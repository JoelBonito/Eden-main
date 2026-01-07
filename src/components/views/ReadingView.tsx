import React from 'react';
import { useBible } from '../../contexts/BibleContext';
import SimpleMarkdown from '../SimpleMarkdown';
import { AudioControls } from '../bible/AudioControls';
import { ResizableSplitView } from '../common/ResizableSplitView';

interface ReadingViewProps {
  bibleText: string;
  secondaryBibleText: string;
  loading: boolean;
  t: (key: string) => string;
  onParallelClick?: (ref: string) => void;
  onStrongClick?: (word: string, code: string) => void;
  isSidePanelOpen?: boolean;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  bibleText,
  secondaryBibleText,
  loading,
  t,
  onParallelClick,
  onStrongClick,
  isSidePanelOpen
}) => {
  const {
    bibleRef,
    goToNextChapter,
    goToPreviousChapter,
    compareMode,
    secondaryBibleRef,
    secondaryTranslation
  } = useBible();

  const isSplit = compareMode; // Only split internally if compare mode. External split handles itself via Flex.

  // Width logic:
  // If external split (isSidePanelOpen), container is flex item and should take available width.
  // ResizableSplitView will fill 100% of this container.
  const containerClass = isSidePanelOpen
    ? 'w-full max-w-none'
    : 'w-full max-w-4xl mx-auto';

  // Primary Content Helper
  const primaryView = (
    <div className={`h-full overflow-y-auto p-4 md:p-8 relative text-bible-text transition-all duration-300 scrollbar-thin scrollbar-thumb-bible-border scrollbar-track-transparent ${compareMode ? 'w-full' : containerClass}`}>
      {loading && (
        <div className="text-center py-10 animate-pulse text-bible-text-light">
          {t('loading')}
        </div>
      )}

      {/* Header da Leitura */}
      <div className="flex justify-between items-end mb-8 border-b border-bible-border pb-4 sticky top-0 bg-bible-paper/95 backdrop-blur z-10 pt-2 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-bible-text tracking-tight">
            {bibleRef.book}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={goToPreviousChapter}
              className="p-1 hover:bg-bible-hover rounded-full transition-colors text-bible-text-light hover:text-bible-accent"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-2xl font-bold text-bible-accent tabular-nums">
              {bibleRef.chapter}
            </span>
            <button
              onClick={goToNextChapter}
              className="p-1 hover:bg-bible-hover rounded-full transition-colors text-bible-text-light hover:text-bible-accent"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="transform scale-90 origin-bottom-right">
          <AudioControls content={bibleText} sourceId="bible" type="bible" />
        </div>
      </div>

      {/* Conteúdo */}
      <div
        className={`prose dark:prose-invert max-w-none font-serif text-lg leading-relaxed bible-content selection:bg-bible-accent/20 ${compareMode ? 'text-base' : ''}`}
      >
        <SimpleMarkdown
          text={bibleText}
          onParallelClick={onParallelClick}
          onStrongClick={onStrongClick}
        />
      </div>
    </div>
  );

  // Secondary Content Helper
  const secondaryView = (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 relative text-bible-text flex-none bg-bible-paper/50 scrollbar-thin scrollbar-thumb-bible-border">
      <div className="mb-8 border-b border-bible-border pb-4 sticky top-0 bg-bible-paper/95 backdrop-blur z-10 pt-2 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-serif font-bold text-bible-text-light">
            {secondaryBibleRef ? secondaryBibleRef.book : bibleRef.book}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-bible-accent">
              {secondaryBibleRef?.chapter || bibleRef.chapter}
            </span>
            <span className="text-xs ml-2 font-sans font-normal bg-bible-secondary text-bible-text px-2 py-1 rounded border border-bible-border">
              {secondaryTranslation}
            </span>
          </div>
        </div>
        <div className="transform scale-90 origin-bottom-right">
          <AudioControls content={secondaryBibleText} sourceId="bible_sec" type="bible" />
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none font-serif text-base leading-relaxed text-bible-text-light">
        <SimpleMarkdown
          text={secondaryBibleText}
          onParallelClick={onParallelClick}
          onStrongClick={onStrongClick}
        />
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex overflow-hidden relative h-full">
      {compareMode ? (
        <ResizableSplitView
          primaryContent={primaryView}
          secondaryContent={secondaryView}
          storageKey="bible-split-ratio"
        />
      ) : (
        primaryView
      )}
    </div>
  );
};
