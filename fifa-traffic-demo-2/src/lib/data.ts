import eventsData from '@/data/events.json';
import venuesData from '@/data/venues.json';
import { Event, Venue } from '@/types';

export function getEvents(): Event[] {
  return eventsData as Event[];
}

export function getVenues(): Venue[] {
  return venuesData as Venue[];
}

export function getVenueById(id: string): Venue | undefined {
  return venuesData.find(v => v.id === id) as Venue | undefined;
}

export function getEventsByVenueId(venueId: string): Event[] {
  return eventsData.filter(e => e.venueId === venueId) as Event[];
}
