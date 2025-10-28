import { Event } from '@prisma/client';

type EventCardProps = {
  event: Event;
};

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200">
      <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
      <p className="text-right text-xs text-gray-500 mt-2">
        {new Date(event.startTime).toLocaleString()}
      </p>
    </div>
  );
};

export default EventCard;
