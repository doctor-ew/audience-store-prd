import enTranslations from '@/data/translations/en.json';
import esTranslations from '@/data/translations/es.json';
import frTranslations from '@/data/translations/fr.json';
import deTranslations from '@/data/translations/de.json';
import koTranslations from '@/data/translations/ko.json';

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ko';

const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  ko: koTranslations,
};

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.en;
}

export function translate(key: string, locale: Locale): string {
  return translations[locale]?.[key] || key;
}
