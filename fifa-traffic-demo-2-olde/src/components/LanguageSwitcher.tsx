'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const currentLang = getUserPreferences().language;
    setLanguage(currentLang);
  }, []);

  const toggleLanguage = () => {
    const prefs = getUserPreferences();
    const newLang = prefs.language === 'en' ? 'es' : 'en';

    prefs.language = newLang;
    saveUserPreferences(prefs);
    setLanguage(newLang);

    const newPath = pathname.replace(/^\/(en|es)/, `/${newLang}`);
    router.push(newPath);
  };

  if (!language) {
    // Render a placeholder on the server and initial client render
    return <div className="px-4 py-2 w-12 h-10 bg-blue-700 rounded animate-pulse" />;
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {language === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
