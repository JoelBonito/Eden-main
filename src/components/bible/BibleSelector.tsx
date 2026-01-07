import React, { useState, useEffect } from 'react';
import { BIBLE_BOOKS, UI_TRANSLATIONS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

interface BibleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentBook: string;
  currentChapter: number;
  onSelect: (book: string, chapter: number) => void;
}

export const BibleSelector: React.FC<BibleSelectorProps> = ({
  isOpen,
  onClose,
  currentBook,
  currentChapter,
  onSelect
}) => {
  const { user } = useAuth();
  const currentLang = user?.language || 'pt';
  const t = UI_TRANSLATIONS[currentLang];

  const [step, setStep] = useState<'BOOK' | 'CHAPTER'>('BOOK');
  const [selectedBookObj, setSelectedBookObj] = useState<(typeof BIBLE_BOOKS)[0] | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('BOOK');
      const book = BIBLE_BOOKS.find(
        (b) => b.name === currentBook || b.nameEn === currentBook || b.nameEs === currentBook
      );
      setSelectedBookObj(book || null);
    }
  }, [isOpen, currentBook]);

  if (!isOpen) return null;

  const handleBookClick = (book: (typeof BIBLE_BOOKS)[0]) => {
    setSelectedBookObj(book);
    setStep('CHAPTER');
  };

  const handleChapterClick = (chapter: number) => {
    if (selectedBookObj) {
      onSelect(selectedBookObj.name, chapter);
      onClose();
    }
  };

  const getBookDisplayName = (book: (typeof BIBLE_BOOKS)[0]) => {
    if (!book) return '';
    if (currentLang === 'en') return book.nameEn;
    if (currentLang === 'es') return book.nameEs;
    return book.name;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-bible-paper w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-bible-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-bible-border bg-bible-secondary/50">
          <div className="flex items-center gap-2">
            {step === 'CHAPTER' && (
              <button
                onClick={() => setStep('BOOK')}
                className="p-2 hover:bg-bible-hover rounded-full transition-colors mr-1 text-bible-text"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            )}
            <h3 className="text-xl font-serif font-bold text-bible-text">
              {step === 'BOOK' ? t.selectBook : getBookDisplayName(selectedBookObj!)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bible-hover rounded-full transition-colors text-bible-text-light hover:text-red-500"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'BOOK' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Old Testament */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bible-accent mb-4 sticky top-0 bg-bible-paper py-2 border-b border-bible-border/50">
                  {t.oldTestament}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'VT').map((book) => (
                    <button
                      key={book.name}
                      onClick={() => handleBookClick(book)}
                      className={`p-3 text-sm text-left rounded-lg transition-all truncate ${
                        currentBook === book.name
                          ? 'bg-bible-accent text-white font-bold shadow-md'
                          : 'hover:bg-bible-secondary text-bible-text border border-transparent hover:border-bible-border'
                      }`}
                    >
                      {getBookDisplayName(book)}
                    </button>
                  ))}
                </div>
              </div>

              {/* New Testament */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-bible-accent mb-4 sticky top-0 bg-bible-paper py-2 border-b border-bible-border/50">
                  {t.newTestament}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BIBLE_BOOKS.filter((b) => b.testament === 'NT').map((book) => (
                    <button
                      key={book.name}
                      onClick={() => handleBookClick(book)}
                      className={`p-3 text-sm text-left rounded-lg transition-all truncate ${
                        currentBook === book.name
                          ? 'bg-bible-accent text-white font-bold shadow-md'
                          : 'hover:bg-bible-secondary text-bible-text border border-transparent hover:border-bible-border'
                      }`}
                    >
                      {getBookDisplayName(book)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chapter Selection
            <div className="animate-in slide-in-from-right-10 duration-200">
              <p className="text-center text-bible-text-light mb-6 text-sm">
                Total: {selectedBookObj?.chapters} {t.chapter?.toLowerCase() || 'capítulos'}
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {Array.from({ length: selectedBookObj?.chapters || 0 }).map((_, i) => {
                  const chapterNum = i + 1;
                  return (
                    <button
                      key={chapterNum}
                      onClick={() => handleChapterClick(chapterNum)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-lg font-medium transition-all ${
                        selectedBookObj?.name === currentBook && chapterNum === currentChapter
                          ? 'bg-bible-accent text-white shadow-lg scale-105'
                          : 'bg-bible-secondary text-bible-text hover:bg-bible-hover hover:scale-105 border border-bible-border'
                      }`}
                    >
                      {chapterNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
