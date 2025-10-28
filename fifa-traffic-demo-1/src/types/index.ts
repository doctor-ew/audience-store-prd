export interface TransitVehicle {
  id: string;
  lat: number;
  lon: number;
  route: string;
  type: 'bus' | 'train';
}