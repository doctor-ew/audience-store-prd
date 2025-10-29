import MapView from '@/components/MapView';
import EventList from '@/components/EventList';
import { getTranslations, Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <main className="h-screen w-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1>{t['app.title']}</h1>
      </header>
      <div className="flex-1 flex">
        <div className="flex-1">
          <MapView />
        </div>
        <EventList translations={t} />
      </div>
    </main>
  );
}
