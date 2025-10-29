'use client';

import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  translations: Record<string, string>;
}

export default function EventCard({ event, translations }: EventCardProps) {
  const eventDate = new Date(event.startTime);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 hover:shadow-xl hover:bg-white/90 transition-all border border-gray-200">
      <h3 className="font-bold text-base mb-2 text-gray-900 leading-tight">
        {event.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
      <div className="flex items-center text-xs text-gray-500 bg-gray-50/50 rounded-lg px-3 py-2">
        <svg
          className="w-4 h-4 mr-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <time dateTime={event.startTime} className="font-medium">
          {eventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          at{' '}
          {eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </time>
      </div>
    </div>
  );
}
