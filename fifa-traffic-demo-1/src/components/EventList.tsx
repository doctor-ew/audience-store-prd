'use client';

import { Event } from '@prisma/client';
import EventCard from './EventCard';
import { useTranslation } from '@/contexts/TranslationContext';

type EventListProps = {
  events: Event[];
};

const EventList = ({ events }: EventListProps) => {
  const { t } = useTranslation();

  return (
    <div className="absolute top-4 left-4 w-full max-w-sm h-[calc(100vh-2rem)] overflow-y-auto space-y-4 p-1">
      <h2 className="text-2xl font-bold text-gray-900 px-3">{t('upcoming_events')}</h2>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
