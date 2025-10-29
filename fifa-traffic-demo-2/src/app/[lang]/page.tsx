import MapView from '@/components/MapView';
import EventList from '@/components/EventList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getEvents } from '@/lib/data';
import { getTranslations, Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
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
    <main className="h-screen w-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t['app.title']}</h1>
        <LanguageSwitcher currentLang={lang} />
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <MapView />
        </div>
        <aside className="w-96 bg-gray-50 overflow-y-auto">
          <EventList events={events} translations={t} />
        </aside>
      </div>
    </main>
  );
}
