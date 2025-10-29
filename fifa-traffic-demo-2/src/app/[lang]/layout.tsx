import type { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atlanta FIFA Navigator',
  description: 'Navigate Atlanta for FIFA World Cup 2026',
};

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'ko' },
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
