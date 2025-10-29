'use client';

import { FC } from 'react';
import useSWR from 'swr';
import EventCard from './EventCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EventListProps {
  translations: Record<string, string>;
}

const EventList: FC<EventListProps> = ({ translations }) => {
  const { data: events, error } = useSWR('/api/events', fetcher);

  if (error) return <div>Failed to load events</div>;
  if (!events) return <div>Loading events...</div>;

  return (
    <aside className="w-80 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">{translations['events.title']}</h2>
      <ul>
        {events.map((event: any) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ul>
    </aside>
  );
};

export default EventList;
