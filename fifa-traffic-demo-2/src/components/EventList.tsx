'use client';

import { Event } from '@/types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  translations: Record<string, string>;
  locale?: string;
}

export default function EventList({ events, translations, locale = 'en' }: EventListProps) {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white/90 backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
        <span className="mr-2">⚽</span>
        {translations['events.title'] || 'Upcoming Events'}
      </h2>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              translations={translations}
              locale={locale}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            {translations['events.none'] || 'No upcoming events'}
          </p>
        )}
      </div>
    </div>
  );
}
