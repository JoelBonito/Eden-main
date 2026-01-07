import React from 'react';
import SimpleMarkdown from '../SimpleMarkdown';
import { AudioControls } from '../bible/AudioControls';
// useLanguage import removido por não ser utilizado diretamente aqui

interface AnalysisViewProps {
  loading: boolean;
  content: string | null;
  type: 'theology' | 'studyGuide' | 'exegesis';
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ loading, content, type }) => {
  // const { t } = useLanguage();

  // Title logic based on type? Or passed as prop?
  // App.tsx rendered title implicitly via tab structure?
  // But AnalysisView acts as the content renderer.

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-70">
        <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
        <p className="text-sm font-bold uppercase tracking-widest">
          {type === 'studyGuide'
            ? 'Gerando Estudo...'
            : type === 'theology'
              ? 'Analisando Teologia...'
              : 'Preparando Exegese...'}
        </p>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-end mb-4">
        <AudioControls content={content} sourceId={type} type="generated" />
      </div>
      <SimpleMarkdown text={content} />
    </div>
  );
};
