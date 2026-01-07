import { useState, useCallback, useEffect } from 'react';
import { getBibleContent } from '../services/geminiService';
import { logger } from '../utils/logger';
import { useBible } from '../contexts/BibleContext';
import { useAuth } from '../contexts/AuthContext';

export const useBibleReader = () => {
  const { bibleRef, compareMode, secondaryBibleRef } = useBible();
  const { user } = useAuth();
  const currentLang = user?.language || 'pt';

  const [bibleText, setBibleText] = useState<string>('');
  const [secondaryBibleText, setSecondaryBibleText] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchText = useCallback(async () => {
    setLoadingText(true);
    setError(null);
    try {
      const text = await getBibleContent(
        bibleRef.book,
        bibleRef.chapter,
        bibleRef.translation,
        currentLang
      );
      setBibleText(text);

      if (compareMode && secondaryBibleRef) {
        const secText = await getBibleContent(
          secondaryBibleRef.book,
          secondaryBibleRef.chapter,
          secondaryBibleRef.translation,
          currentLang
        );
        setSecondaryBibleText(secText);
      } else {
        setSecondaryBibleText('');
      }
    } catch (err) {
      logger.error('Error fetching text', err);
      setBibleText(currentLang === 'en' ? 'Error loading text.' : 'Erro ao carregar texto.');
      setError('Failed to load text');
    } finally {
      setLoadingText(false);
    }
  }, [bibleRef, compareMode, secondaryBibleRef, currentLang]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  return {
    bibleText,
    secondaryBibleText,
    loadingText,
    error,
    refetch: fetchText
  };
};
