import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UI_TRANSLATIONS } from '../utils/constants';
import { Language } from '../types';

export type TranslationKey = keyof typeof UI_TRANSLATIONS.pt;

interface LanguageContextData {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextData>({} as LanguageContextData);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<Language>('pt');

  useEffect(() => {
    const saved = localStorage.getItem('eden_language');
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) {
      setCurrentLang(saved as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('eden_language', lang);
  };

  const t = (key: string): string => {
    const k = key as TranslationKey;
    // Fallback chain: Chosen Lang -> PT (Default) -> Key name
    return UI_TRANSLATIONS[currentLang]?.[k] || UI_TRANSLATIONS.pt[k] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
