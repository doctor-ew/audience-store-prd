'use client';

import { Event } from '@prisma/client';
import { useTranslation } from '@/contexts/TranslationContext';

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  const { t } = useTranslation();

  // Generate translation keys from fifaEventId (e.g., M01 -> event_m01_name)
  const eventKey = event.fifaEventId.toLowerCase();
  const nameKey = `event_${eventKey}_name`;
  const descriptionKey = `event_${eventKey}_description`;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800">{t(nameKey)}</h3>
      <p className="text-gray-600 text-sm mt-1">{t(descriptionKey)}</p>
      <p className="text-right text-xs text-gray-500 mt-2">
        {new Date(event.startTime).toLocaleString()}
      </p>
    </div>
  );
};

export default EventCard;
