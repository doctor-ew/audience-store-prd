import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { i18n } from '@/i18n/i18n-config';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { prisma } from '@/lib/prisma';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA Traffic Demo",
  description: "Real-time MARTA transit map for FIFA events",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetch initial translations from database
  const translations = await prisma.translation.findMany({
    where: { locale: lang },
  });

  const translationsObj = translations.reduce((acc, t) => {
    acc[t.key] = t.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TranslationProvider initialLocale={lang} initialTranslations={translationsObj}>
          {children}
          <LanguageSwitcher />
        </TranslationProvider>
      </body>
    </html>
  );
}
