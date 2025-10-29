import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { TransitVehicle } from '@/types';
import { isRunningInCodespaces } from './codespaces';

const MARTA_BUS_API_URL = 'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb';
const MARTA_TRAIN_API_URL = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${process.env.MTAK}`;

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

export async function fetchTrainData(): Promise<TransitVehicle[]> {
  // Try direct connection first, then fallback to proxy
  console.log("MARTA Train API Key:", process.env.MARTA_TRAIN_API_KEY?.substring(0, 10) + '...');
  console.log("Full Train URL:", MARTA_TRAIN_API_URL);

  // Try direct connection first
  try {
    console.log("Attempting direct connection to MARTA Train API...");
    const directResponse = await fetch(MARTA_TRAIN_API_URL, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (directResponse.ok) {
      console.log("✓ Direct connection successful!");
      const data = await directResponse.json();

      if (!Array.isArray(data)) {
        console.error('Direct API returned non-array:', typeof data, data);
        throw new Error('Non-array response');
      }

      return processTrainData(data);
    }
    console.log("Direct connection failed, trying proxy...");
  } catch (directError) {
    console.log("Direct connection error:", directError instanceof Error ? directError.message : directError);
  }

  // Fallback to proxy
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(MARTA_TRAIN_API_URL)}`;
  console.log("Using corsproxy.io for MARTA Train API");

  try {
    const response = await fetch(proxyUrl, { next: { revalidate: 30 } });
    if (!response.ok) {
      console.error('MARTA Train API request failed:', response.statusText);
      return [];
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Proxy API returned non-array data:', typeof data, data);
      return [];
    }

    return processTrainData(data);
  } catch (error) {
    console.error('Error fetching or parsing MARTA train data:', error);
    return [];
  }
}

function processTrainData(data: any[]): TransitVehicle[] {
  console.log(`Processing ${data.length} train records from MARTA API`);

  // Deduplicate trains by TRAIN_ID
  const uniqueTrains = new Map();
  data.forEach((train: any) => {
    if (train.TRAIN_ID && train.LATITUDE && train.LONGITUDE && train.LINE) {
      uniqueTrains.set(train.TRAIN_ID, train);
    }
  });

  const trains: TransitVehicle[] = Array.from(uniqueTrains.values()).map((train: any) => ({
    id: train.TRAIN_ID,
    lat: parseFloat(train.LATITUDE),
    lon: parseFloat(train.LONGITUDE),
    route: train.LINE,
    type: 'train',
  }));

  console.log(`Returning ${trains.length} unique trains`);
  return trains;
}