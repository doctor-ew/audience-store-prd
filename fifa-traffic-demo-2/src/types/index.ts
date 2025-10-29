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

export interface TransitVehicle {
  id: string;
  latitude: number;
  longitude: number;
  route: string;
  type: 'bus' | 'train';
}

export interface MartaBus {
  id: string;
  latitude: number;
  longitude: number;
  route: string;
}

export interface MartaTrain {
  id: string;
  latitude: number;
  longitude: number;
  line: string;
  destination: string;
}
