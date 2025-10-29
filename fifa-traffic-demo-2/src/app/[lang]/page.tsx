import MapView from '@/components/MapView';
import EventList from '@/components/EventList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getEvents } from '@/lib/data';
import { getTranslations, Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'ko' },
  ];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params as { lang: Locale };
  const events = getEvents();
  const t = getTranslations(lang);

  return (
    <main className="h-screen w-screen flex flex-col relative">
      {/* Full Screen Map */}
      <div className="absolute inset-0">
        <MapView />
      </div>

      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-blue-600/95 to-blue-600/80 backdrop-blur-sm text-white flex items-center justify-between shadow-lg">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">⚽</span>
          {t['app.title']}
        </h1>
        <LanguageSwitcher currentLang={lang} />
      </header>

      {/* Translucent Event Schedule Sidebar - Right Side */}
      <aside className="absolute top-20 right-4 bottom-4 w-96 z-10 rounded-xl shadow-2xl overflow-hidden">
        <EventList events={events} translations={t} locale={lang} />
      </aside>
    </main>
  );
}
