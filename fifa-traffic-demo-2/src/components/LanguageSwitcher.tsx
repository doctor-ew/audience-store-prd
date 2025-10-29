'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Locale;
}

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const switchLanguage = (newLang: Locale) => {
    const prefs = getUserPreferences();
    prefs.language = newLang;
    saveUserPreferences(prefs);

    const newPath = pathname.replace(/^\/(en|es|fr|de|ko)/, `/${newLang}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-semibold border border-white/30 backdrop-blur-sm flex items-center gap-2"
        aria-label="Switch language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <span className="text-sm">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden min-w-[180px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                lang.code === currentLang ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-gray-900">{lang.name}</span>
              {lang.code === currentLang && <span className="ml-auto text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
