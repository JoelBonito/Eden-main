import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useBible } from './BibleContext';
import { useAuth } from './AuthContext';
import { getBibleContent, translateForAudio } from '../services/geminiService';
import { Language } from '../types';
import { AVAILABLE_TRANSLATIONS } from '../utils/constants';
import { logger } from '../utils/logger';

interface AudioContextType {
  isSpeaking: boolean;
  playingSource: string | null;
  isPreparingAudio: boolean;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  audioTargetLang: Language;
  setAudioTargetLang: (lang: Language) => void;
  activeAudioSettingsPanel: string | null;
  setActiveAudioSettingsPanel: (id: string | null) => void;
  handleSpeak: (
    text: string,
    sourceId: string,
    contextType: 'bible' | 'generated'
  ) => Promise<void>;
  handleStopSpeak: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bibleRef } = useBible();
  const { user } = useAuth();
  const currentLang = user?.language || 'pt';

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playingSource, setPlayingSource] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [audioTargetLang, setAudioTargetLang] = useState<Language>('pt');
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [activeAudioSettingsPanel, setActiveAudioSettingsPanel] = useState<string | null>(null);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setAudioTargetLang(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) setVoices(available);
    };
    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Fallback interval logic omitted for brevity as main event usually works,
    // but included in original. Re-adding minimal fallback.
    const interval = setInterval(() => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const cleanTextForSpeech = useCallback((text: string): string => {
    if (!text) return '';
    return text
      .replace(/<[HG]\d+>/g, '')       // Remove marcadores Strong
      .replace(/\*\*\d+\.\*\*/g, '')   // Remove "**1.**" markdown
      .replace(/^\d+\s+/gm, '')        // Remove números no início de linha (versículos)
      .replace(/\b\d+:\d+\b/g, '')     // Remove referências tipo "3:16"
      .replace(/[*#]/g, '')             // Remove asteriscos e hashes
      .replace(/\(.*?\)/g, '')          // Remove parênteses
      .replace(/\s+/g, ' ')             // Normaliza espaços
      .trim();
  }, []);

  // Mapeamento de vozes preferidas por idioma (priorizando vozes nativas de alta qualidade)
  const PREFERRED_VOICE_LANGS: Record<string, string[]> = {
    pt: ['pt-BR', 'pt-PT', 'pt'],
    en: ['en-US', 'en-GB', 'en-AU', 'en'],
    es: ['es-ES', 'es-MX', 'es-419', 'es'],
  };

  const selectBestVoice = useCallback((targetLang: string, availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    const preferredLangs = PREFERRED_VOICE_LANGS[targetLang] || [targetLang];

    for (const langCode of preferredLangs) {
      // Priorizar vozes que NÃO sejam "compact" ou de baixa qualidade
      const qualityVoice = availableVoices.find(
        (v) => v.lang === langCode && !v.name.toLowerCase().includes('compact')
      );
      if (qualityVoice) return qualityVoice;

      // Fallback para qualquer voz com esse código de idioma
      const anyVoice = availableVoices.find((v) => v.lang === langCode);
      if (anyVoice) return anyVoice;
    }

    return null;
  }, []);

  const handleStopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setPlayingSource(null);
  }, []);

  const handleSpeak = useCallback(
    async (textToSpeak: string, sourceId: string, contextType: 'bible' | 'generated') => {
      if (!textToSpeak) return;
      if (isSpeaking && playingSource === sourceId) {
        handleStopSpeak();
        return;
      }
      window.speechSynthesis.cancel();
      setIsPreparingAudio(true);
      setPlayingSource(sourceId);

      let finalSpeechText = cleanTextForSpeech(textToSpeak);
      const targetLang = audioTargetLang || currentLang;

      if (targetLang !== currentLang) {
        try {
          if (contextType === 'bible') {
            let targetTranslation = 'NIV';
            if (targetLang === 'pt') targetTranslation = 'NVI';
            if (targetLang === 'es') targetTranslation = 'RVR1960';
            const t1Label =
              AVAILABLE_TRANSLATIONS.find((t) => t.id === targetTranslation)?.label ||
              targetTranslation;
            const translatedContent = await getBibleContent(
              bibleRef.book,
              bibleRef.chapter,
              t1Label,
              targetLang
            );
            finalSpeechText = cleanTextForSpeech(translatedContent);
          } else {
            finalSpeechText = await translateForAudio(finalSpeechText, targetLang);
          }
        } catch (e) {
          logger.error('Audio conversion failed', e);
        }
      }

      setIsPreparingAudio(false);
      const utterance = new SpeechSynthesisUtterance(finalSpeechText);
      const targetLangCode = targetLang || 'pt';
      const bestVoice = selectBestVoice(targetLangCode, voices);

      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang =
          targetLangCode === 'pt' ? 'pt-BR' : targetLangCode === 'en' ? 'en-US' : 'es-ES';
      }

      utterance.rate = speechRate;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setPlayingSource(sourceId);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setPlayingSource(null);
      };
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        setIsSpeaking(false);
        setPlayingSource(null);
      };

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [
      cleanTextForSpeech,
      selectBestVoice,
      speechRate,
      isSpeaking,
      playingSource,
      voices,
      audioTargetLang,
      currentLang,
      bibleRef,
      handleStopSpeak
    ]
  );

  return (
    <AudioContext.Provider
      value={{
        isSpeaking,
        playingSource,
        isPreparingAudio,
        speechRate,
        setSpeechRate,
        audioTargetLang,
        setAudioTargetLang,
        activeAudioSettingsPanel,
        setActiveAudioSettingsPanel,
        handleSpeak,
        handleStopSpeak
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
