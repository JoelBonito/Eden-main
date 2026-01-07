import React from 'react';
import { DevotionalContent } from '../../types';
import { AudioControls } from '../bible/AudioControls';
import { useLanguage } from '../../contexts/LanguageContext';

interface DevotionalViewProps {
  loading: boolean;
  content: DevotionalContent | null;
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  isGuest: boolean;
  error?: string | null;
}

export const DevotionalView: React.FC<DevotionalViewProps> = ({
  loading,
  content,
  topic,
  onTopicChange,
  onGenerate,
  isGuest,
  error
}) => {
  const { t } = useLanguage();

  const formatShareText = () => {
    if (!content) return '';
    const appUrl = window.location.origin;
    return `*${content.title}*\n\n"${content.scriptureText}"\n(${content.scriptureReference})\n\n${content.reflection}\n\n_${content.finalQuote}_\n\nVia App ÉDEN: ${appUrl}`;
  };

  const shareToSocial = (platform: 'whatsapp' | 'twitter' | 'copy') => {
    const text = formatShareText();
    const encoded = encodeURIComponent(text);
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(text);
      alert(t('copied'));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-bible-border bg-bible-card">
        <label className="block text-xs font-bold text-bible-text-light uppercase tracking-wide mb-2">
          {t('devotionalTopic')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 bg-bible-bg border border-bible-border rounded-lg px-4 py-2 text-bible-text outline-none focus:border-bible-accent transition-colors"
            placeholder={t('devotionalPlaceholder')}
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
          />
          <button
            onClick={onGenerate}
            className="px-4 sm:px-6 py-2 bg-bible-accent text-white text-sm sm:text-base font-bold rounded-lg hover:bg-bible-accent-hover transition-all shadow-md active:transform active:scale-95 w-full sm:w-auto"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : t('dailyDevotional')}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {isGuest && (
          <p className="text-[10px] text-red-500 mt-2 font-bold">
            <i className="fas fa-lock ml-1"></i> Login necessário para salvar no histórico.
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-bible-paper">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <i className="fas fa-praying-hands fa-bounce text-4xl text-bible-accent mb-4"></i>
            <p className="text-sm font-bold uppercase tracking-widest">Preparando seu coração...</p>
          </div>
        ) : !content ? (
          <div className="text-center py-20 opacity-50">
            <i className="fas fa-dove text-6xl mb-4 text-bible-border"></i>
            <p>Digite um tema acima para começar seu momento com Deus.</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex justify-end mb-4">
              <AudioControls
                content={`Título: ${content.title}. Leitura: ${content.scriptureText}. Reflexão: ${content.reflection}. Oração: ${content.prayer}`}
                sourceId="devotional"
                type="generated"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-bible-text mb-4 sm:mb-6 text-center">
              {content.title}
            </h2>
            <div className="bg-bible-card p-6 rounded-xl border border-bible-border shadow-sm mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-bible-accent"></div>
              <p className="font-serif text-xl italic text-bible-text mb-2 leading-relaxed">
                "{content.scriptureText}"
              </p>
              <p className="text-right text-sm font-bold text-bible-accent uppercase tracking-wider">
                — {content.scriptureReference}
              </p>
            </div>
            <div className="prose prose-brown max-w-none mb-8">
              <h3 className="font-bold text-bible-text uppercase text-sm tracking-widest mb-2 border-b border-bible-border pb-1">
                Reflexão
              </h3>
              <p className="text-lg leading-relaxed text-justify">{content.reflection}</p>
            </div>
            <div className="bg-bible-secondary/50 p-6 rounded-xl border border-bible-border mb-8">
              <h3 className="font-bold text-bible-text uppercase text-sm tracking-widest mb-3 flex items-center">
                <i className="fas fa-praying-hands mr-2"></i> Oração
              </h3>
              <p className="italic text-bible-text-light text-lg">"{content.prayer}"</p>
            </div>
            <div className="text-center mb-10">
              <span className="inline-block px-6 py-3 border-y-2 border-bible-border text-xl font-serif font-bold text-bible-accent">
                {content.finalQuote}
              </span>
            </div>
            <div className="flex justify-center gap-3 sm:gap-4 border-t border-bible-border pt-4 sm:pt-6 mt-6 sm:mt-8">
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <i className="fab fa-whatsapp text-2xl"></i>
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <i className="fab fa-x-twitter text-xl"></i>
              </button>
              <button
                onClick={() => shareToSocial('copy')}
                className="w-12 h-12 rounded-full bg-bible-text text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Copiar"
              >
                <i className="fas fa-copy text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
