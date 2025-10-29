'use client';

import { FC } from 'react';

interface Event {
  id: string;
  name: string;
  startTime: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
  return (
    <li className="mb-4">
      <h3 className="font-semibold">{event.name}</h3>
      <p className="text-sm text-gray-600">
        {new Date(event.startTime).toLocaleString()}
      </p>
    </li>
  );
};

export default EventCard;
