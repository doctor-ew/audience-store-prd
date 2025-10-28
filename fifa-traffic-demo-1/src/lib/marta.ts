import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { TransitVehicle } from '@/types';
import { isRunningInCodespaces } from './codespaces';

const MARTA_BUS_API_URL = 'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb';

export async function fetchBusData(): Promise<TransitVehicle[]> {
  try {
    const response = await fetch(MARTA_BUS_API_URL, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });
    if (!response.ok) {
      console.error('MARTA Bus API request failed:', response.statusText);
      return [];
    }
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    
    const buses: TransitVehicle[] = feed.entity.map((entity) => ({
      id: entity.id,
      lat: entity.vehicle.position.latitude,
      lon: entity.vehicle.position.longitude,
      route: entity.vehicle.trip.routeId,
      type: 'bus',
    }));
    return buses;
  } catch (error) {
    console.error('Error fetching or parsing MARTA bus data:', error);
    return [];
  }
}

const MARTA_TRAIN_API_URL = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${process.env.MARTA_TRAIN_API_KEY}`;

export async function fetchTrainData(): Promise<TransitVehicle[]> {
  let url = MARTA_TRAIN_API_URL;
  if (isRunningInCodespaces()) {
    console.log("Codespaces environment detected. Using proxy for MARTA Train API.");
    url = `https://api.allorigins.win/raw?url=${encodeURIComponent(MARTA_TRAIN_API_URL)}`;
  } else {
    console.log("Using direct connection for MARTA Train API.");
  }

  try {
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) {
      console.error('MARTA Train API request failed:', response.statusText);
      return [];
    }
    const data = await response.json();
    
    // Deduplicate trains by TRAIN_ID
    const uniqueTrains = new Map();
    data.forEach((train: any) => {
      uniqueTrains.set(train.TRAIN_ID, train);
    });

    const trains: TransitVehicle[] = Array.from(uniqueTrains.values()).map((train: any) => ({
      id: train.TRAIN_ID,
      lat: parseFloat(train.LATITUDE),
      lon: parseFloat(train.LONGITUDE),
      route: train.LINE,
      type: 'train',
    }));
    return trains;
  } catch (error) {
    console.error('Error fetching or parsing MARTA train data:', error);
    return [];
  }
}