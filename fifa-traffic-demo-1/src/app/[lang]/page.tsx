import { PrismaClient } from '@prisma/client';
import MapView from '@/components/MapView';
import EventList from '@/components/EventList';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';

const prisma = new PrismaClient();

async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: {
      startTime: 'asc',
    },
  });
  return events;
}

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const events = await getEvents();

  return (
    <main className="h-screen w-screen relative">
      <MapView />
      <EventList events={events} dictionary={dictionary} />
    </main>
  );
}
