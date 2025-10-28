'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n } from '@/i18n/i18n-config';

export default function LanguageSwitcher() {
  const pathName = usePathname();

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="absolute top-4 right-20 bg-white p-1 rounded-md shadow-md flex space-x-2 text-sm">
      {i18n.locales.map((locale) => {
        const isActive = pathName.startsWith(`/${locale}`);
        return (
          <Link
            key={locale}
            href={redirectedPathName(locale)}
            className={`px-2 py-1 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
