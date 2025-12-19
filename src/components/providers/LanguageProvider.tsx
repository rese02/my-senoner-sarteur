
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from '@/lib/translations';
import { de, it, enUS } from 'date-fns/locale';

// Define the shape of the context
interface LanguageContextType {
  lang: Language;
  t: typeof translations['de']; // Use 'de' as the base type
  setLang: (lang: Language) => void;
  dateLocale: Locale;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('de'); // Default to German

  useEffect(() => {
    // This effect runs only on the client side
    // 1. Check if a language is already saved in localStorage
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && ['de', 'it', 'en'].includes(savedLang)) {
      setLangState(savedLang);
      return;
    }

    // 2. If not, detect the browser's language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'it') {
      setLangState('it');
    } else if (browserLang === 'en') {
      setLangState('en');
    } else {
      setLangState('de'); // Fallback to German
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app-language', newLang);
  };

  // Select the correct date-fns locale based on the current language
  const dateLocale = lang === 'it' ? it : lang === 'en' ? enUS : de;

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang, dateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for easy consumption of the context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
