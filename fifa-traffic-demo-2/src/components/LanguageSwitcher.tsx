'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const prefs = getUserPreferences();
    const newLang: Locale = currentLang === 'en' ? 'es' : 'en';

    prefs.language = newLang;
    saveUserPreferences(prefs);

    // Navigate to new language route
    const newPath = pathname.replace(/^\/(en|es)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
      aria-label="Switch language"
    >
      {currentLang === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
