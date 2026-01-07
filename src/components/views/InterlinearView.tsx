import React from 'react';
import { InterlinearVerse, InterlinearWord } from '../../types';

interface InterlinearViewProps {
  loading: boolean;
  data: InterlinearVerse[] | null;
  onLoadMore: (reset?: boolean) => void;
  onWordClick: (word: InterlinearWord, verseIdx: number, wordIdx: number) => void;
}

export const InterlinearView: React.FC<InterlinearViewProps> = ({
  loading,
  data,
  onLoadMore,
  onWordClick
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-20 opacity-70">
          <i className="fas fa-circle-notch fa-spin text-4xl text-bible-accent mb-4"></i>
          <p className="text-sm font-bold uppercase tracking-widest">Traduzindo...</p>
        </div>
      )}

      {data?.map((verse, i) => (
        <div key={i} className="mb-4 sm:mb-6 border-b border-bible-border pb-3 sm:pb-4">
          <span className="font-bold text-bible-accent mr-2">{verse.verseNumber}</span>
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            {verse.words.map((w, j) => (
              <div
                key={j}
                className="flex flex-col items-center p-1 rounded hover:bg-bible-secondary cursor-pointer min-w-[25px] sm:min-w-[30px]"
                onClick={() => onWordClick(w, i, j)}
              >
                <span className="text-lg font-serif">{w.original}</span>
                <span className="text-[10px] text-bible-text-light">{w.transliteration}</span>
                <span className="text-xs font-bold text-bible-text mt-1">{w.portuguese}</span>
                <span className="text-[9px] text-bible-accent bg-bible-paper px-1 rounded mt-1 border border-bible-border">
                  {w.strong}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {data && (
        <button
          onClick={() => onLoadMore(false)}
          disabled={loading}
          className="w-full py-2 bg-bible-secondary rounded text-sm font-bold text-bible-text-light hover:bg-bible-hover"
        >
          {loading ? 'Carregando...' : 'Carregar Mais Versículos'}
        </button>
      )}
    </div>
  );
};
