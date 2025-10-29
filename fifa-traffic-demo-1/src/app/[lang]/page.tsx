import { prisma } from '@/lib/prisma';
import MapView from '@/components/MapView';
import EventList from '@/components/EventList';
import { getDictionary } from '@/i18n/get-dictionary';
import { i18n, Locale } from '@/i18n/i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const dynamic = 'force-dynamic';

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: {
      startTime: 'asc',
    },
  });
  return events;
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const events = await getEvents();

  return (
    <main className="h-screen w-screen relative">
      <MapView />
      <EventList events={events} />
    </main>
  );
}
