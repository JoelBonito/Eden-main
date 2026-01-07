import React from 'react';
import { AnalysisView } from './AnalysisView';

interface ExegesisViewProps {
  loading: boolean;
  content: string | null;
  input: string;
  setInput: (val: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export const ExegesisView: React.FC<ExegesisViewProps> = ({
  loading,
  content,
  input,
  setInput,
  onAnalyze,
  onReset
}) => {
  return (
    <>
      <div className="mb-4 sm:mb-6 bg-bible-card p-3 sm:p-4 rounded-lg border border-bible-border shadow-sm">
        <h3 className="font-bold text-bible-accent mb-2 text-sm uppercase tracking-wide">
          Análise Personalizada
        </h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cole um versículo específico ou texto para exegese profunda..."
          className="w-full p-3 border border-bible-border rounded mb-3 text-sm focus:border-bible-accent outline-none font-serif text-bible-text"
          rows={3}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-bible-accent text-white rounded text-sm font-bold hover:bg-bible-accent-hover disabled:opacity-50"
          >
            Analisar Texto
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-bible-secondary text-bible-text rounded text-sm font-bold hover:bg-bible-border"
          >
            Restaurar Capítulo
          </button>
        </div>
      </div>

      <AnalysisView loading={loading} content={content} type="exegesis" />
    </>
  );
};
