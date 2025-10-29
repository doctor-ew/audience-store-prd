'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Translations = Record<string, string>;

interface TranslationContextType {
  translations: Translations;
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({
  children,
  initialLocale = 'en',
  initialTranslations = {}
}: {
  children: ReactNode;
  initialLocale?: string;
  initialTranslations?: Translations;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    // Skip fetch on initial mount since we have server-rendered translations
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    // Fetch translations when locale changes
    async function fetchTranslations() {
      try {
        const response = await fetch(`/api/translations?locale=${locale}`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      }
    }

    fetchTranslations();
  }, [locale, isInitialMount]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    // Update URL without page reload
    window.history.replaceState(null, '', `/${newLocale}`);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ translations, locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
