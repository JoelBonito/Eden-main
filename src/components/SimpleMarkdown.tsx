import React, { memo } from 'react';
import { ABBREVIATION_MAP, BIBLE_BOOKS } from '../utils/constants';

interface SimpleMarkdownProps {
  text: string;
  onParallelClick?: (ref: string) => void;
  onStrongClick?: (word: string, code: string) => void;
}

const SimpleMarkdown = memo(({ text, onParallelClick, onStrongClick }: SimpleMarkdownProps) => {
  if (!text) return null;

  if (text.startsWith('⚠️')) {
    return (
      <div className="my-6 p-6 bg-red-100 border border-red-200 rounded-xl flex items-start gap-4 text-red-900 shadow-sm">
        <i className="fas fa-exclamation-triangle text-2xl text-red-500 mt-1"></i>
        <div>
          <h3 className="font-bold text-lg text-red-700 mb-1">Atenção</h3>
          <p className="text-sm leading-relaxed">{text.replace('⚠️', '').trim()}</p>
        </div>
      </div>
    );
  }

  const paragraphs = text.split('\n').map((line, i) => {
    // Optimization: Check for parallel line signature early
    const trimmed = line.trim();

    // Check if line looks like a reference line: (Ref1; Ref2)
    // It must start with '(' and end with ')' and contain at least one known book name (abbr or full)
    const hasParentheses = trimmed.startsWith('(') && trimmed.endsWith(')');
    let isParallelLine = false;

    if (hasParentheses) {
      // Check for abbreviations
      const hasAbbr = Object.keys(ABBREVIATION_MAP).some((abbr) => line.includes(abbr));
      // Check for full names (e.g., Mateus, Lucas, Gênesis)
      const hasFullName = BIBLE_BOOKS.some(
        (b) => line.includes(b.name) || line.includes(b.nameEn) || line.includes(b.nameEs)
      );

      if (hasAbbr || hasFullName) {
        isParallelLine = true;
      }
    }

    if (isParallelLine && onParallelClick) {
      const refs = line
        .replace(/[()]/g, '')
        .split(';')
        .map((s) => s.trim());
      return (
        <div key={i} className="mb-6 -mt-2 ml-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-bible-text-light uppercase tracking-wider mr-1">
              Paralelos:
            </span>
            {refs.map((ref, idx) => (
              <button
                key={idx}
                onClick={() => onParallelClick(ref)}
                className="px-2 py-0.5 rounded bg-bible-secondary border border-bible-border text-xs text-bible-accent hover:text-white hover:bg-bible-accent transition-all font-mono"
                title="Abrir em modo de comparação"
              >
                <i className="fas fa-columns mr-1 text-[10px]"></i> {ref}
              </button>
            ))}
          </div>
        </div>
      );
    }

    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={i} className="mb-2 min-h-[1em]">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Verse numbers
            return (
              <strong key={j} className="text-bible-accent font-bold mr-1">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('# '))
            return (
              <h1
                key={j}
                className="text-3xl font-serif font-bold text-bible-text my-4 pb-2 border-b border-bible-border"
              >
                {part.substring(2)}
              </h1>
            );
          if (part.startsWith('## '))
            return (
              <h2 key={j} className="text-xl font-bold text-bible-text-light mt-6 mb-3">
                {part.substring(3)}
              </h2>
            );

          // Check for Strong codes formatted as Word<H1234> or Word <H1234>
          if (onStrongClick && part.includes('<')) {
            // Split by regex allowing for optional whitespace before the bracket
            const subParts = part.split(/([\wÀ-ÿ-]+\s*<[HG]\d+>)/g);
            return (
              <span key={j}>
                {subParts.map((sub, k) => {
                  const match = sub.match(/^([\wÀ-ÿ-]+)\s*<([HG]\d+)>$/);
                  if (match) {
                    const [, word, code] = match;
                    return (
                      <span
                        key={k}
                        onClick={() => onStrongClick(word, code)}
                        className="cursor-pointer border-b border-dotted border-bible-accent/50 hover:bg-bible-secondary hover:text-bible-accent transition-colors"
                        title={`Strong: ${code}`}
                      >
                        {word}
                      </span>
                    );
                  }
                  return <span key={k}>{sub}</span>;
                })}
              </span>
            );
          }

          return <span key={j}>{part}</span>;
        })}
      </div>
    );
  });

  return (
    <div className="text-bible-text leading-relaxed font-serif text-lg md:text-xl">
      {paragraphs}
    </div>
  );
});

export default SimpleMarkdown;
