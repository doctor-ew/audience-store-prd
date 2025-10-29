import eventsData from '@/data/events.json';
import venuesData from '@/data/venues.json';

export interface Event {
  id: string;
  fifaEventId: string;
  name: string;
  description: string;
  startTime: string;
  venueId: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
}

export function getEvents(): Event[] {
  return eventsData;
}

export function getVenues(): Venue[] {
  return venuesData;
}

export function getVenueById(id: string): Venue | undefined {
  return venuesData.find(v => v.id === id);
}

export function getEventsByVenueId(venueId: string): Event[] {
  return eventsData.filter(e => e.venueId === venueId);
}
