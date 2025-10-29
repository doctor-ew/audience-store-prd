'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { i18n } from '@/i18n/i18n-config';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <div className="absolute top-4 right-20 bg-white p-1 rounded-md shadow-md flex space-x-2 text-sm">
      {i18n.locales.map((loc) => {
        const isActive = locale === loc;
        return (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`px-2 py-1 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
