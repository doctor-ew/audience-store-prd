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
      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-semibold border border-white/30 backdrop-blur-sm flex items-center gap-2"
      aria-label="Switch language"
    >
      <span className="text-xl">🌐</span>
      <span>{currentLang === 'en' ? 'Español' : 'English'}</span>
    </button>
  );
}
