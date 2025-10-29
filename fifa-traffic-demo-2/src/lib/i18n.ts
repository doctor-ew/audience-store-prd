import enTranslations from '@/data/translations/en.json';
import esTranslations from '@/data/translations/es.json';

export type Locale = 'en' | 'es';

const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
};

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.en;
}

export function translate(key: string, locale: Locale): string {
  return translations[locale]?.[key] || key;
}
