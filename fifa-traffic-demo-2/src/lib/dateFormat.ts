import { Locale } from './i18n';

const localeMap: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ko: 'ko-KR',
};

const use24Hour: Locale[] = ['es', 'fr', 'de', 'ko'];

export function formatEventDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  const localeCode = localeMap[locale] || localeMap.en;

  return date.toLocaleDateString(localeCode, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatEventTime(dateString: string, locale: Locale): string {
  const date = new Date(dateString);
  const localeCode = localeMap[locale] || localeMap.en;

  return date.toLocaleTimeString(localeCode, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour.includes(locale),
  });
}
