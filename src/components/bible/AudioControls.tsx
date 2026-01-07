import React from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { Language } from '../../types';

interface AudioControlsProps {
  content: string;
  sourceId: string;
  type: 'bible' | 'generated';
}

export const AudioControls: React.FC<AudioControlsProps> = ({ content, sourceId, type }) => {
  const {
    isSpeaking,
    playingSource,
    isPreparingAudio,
    handleSpeak,
    handleStopSpeak,
    activeAudioSettingsPanel,
    setActiveAudioSettingsPanel,
    speechRate,
    setSpeechRate,
    audioTargetLang,
    setAudioTargetLang
  } = useAudio();

  const isThisPlaying = isSpeaking && playingSource === sourceId;

  return (
    <div className="flex items-center gap-2 bg-bible-secondary rounded-full px-2 py-1 border border-bible-border shadow-sm">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent toggling parent views if inside clickable area
          if (isThisPlaying) {
            handleStopSpeak();
          } else {
            handleSpeak(content, sourceId, type);
          }
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isThisPlaying ? 'bg-red-500 text-white' : 'bg-bible-accent text-bible-text hover:bg-bible-accent-hover shadow-sm border border-bible-border/30'}`}
        title={isThisPlaying ? 'Parar leitura' : 'Ouvir'}
      >
        {isPreparingAudio && playingSource === sourceId ? (
          <i className="fas fa-circle-notch fa-spin text-xs"></i>
        ) : (
          <i className={`fas ${isThisPlaying ? 'fa-stop' : 'fa-volume-up'} text-xs`}></i>
        )}
      </button>

      <div className="relative group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveAudioSettingsPanel(activeAudioSettingsPanel === sourceId ? null : sourceId);
          }}
          className="w-8 h-8 rounded-full text-bible-text-light hover:text-bible-accent flex items-center justify-center"
        >
          <i className="fas fa-cog text-xs"></i>
        </button>

        {activeAudioSettingsPanel === sourceId && (
          <div
            className="absolute top-full right-0 mt-2 bg-layer-2 border border-bible-border rounded-lg shadow-xl p-3 w-48 z-50 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3">
              <label className="block text-[10px] font-bold uppercase text-bible-text-light mb-1">
                Velocidade
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-bible-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-bible-text-light mt-1">
                <span>0.5x</span>
                <span>{speechRate}x</span>
                <span>2x</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-bible-text-light mb-1">
                Idioma do Áudio
              </label>
              <select
                value={audioTargetLang}
                onChange={(e) => setAudioTargetLang(e.target.value as Language)}
                className="w-full text-xs border border-bible-border rounded p-1"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
