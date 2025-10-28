import 'server-only';
import type { Locale } from './i18n-config';

// We use a Record to type the dictionaries object
const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import('./en.json').then((r) => r.default),
  es: () => import('./es.json').then((r) => r.default),
};

export const getDictionary = async (locale: Locale) => {
  // We use a type assertion to ensure the result is of the expected type
  return dictionaries[locale]?.() ?? dictionaries.en();
};
