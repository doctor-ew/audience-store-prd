import { isRunningInCodespaces } from './codespaces';
import gtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { MartaBus, MartaTrain } from '@/types';

const MARTA_BUS_URL = 'https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb';
const MARTA_TRAIN_BASE = 'https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata';

export async function fetchMartaBuses(): Promise<MartaBus[]> {
  try {
    // MARTA Bus GTFS-RT endpoint does not require an API key
    const response = await fetch(MARTA_BUS_URL, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      console.error('MARTA Bus API request failed:', response.statusText);
      return [];
    }

    const buffer = await response.arrayBuffer();
    const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    return feed.entity
      .filter(entity => entity.vehicle?.position)
      .map(entity => ({
        id: entity.vehicle!.vehicle!.id || '',
        latitude: entity.vehicle!.position!.latitude!,
        longitude: entity.vehicle!.position!.longitude!,
        route: entity.vehicle!.trip?.routeId || 'Unknown',
      }));
  } catch (error) {
    console.error('Failed to fetch MARTA buses:', error);
    return [];
  }
}

export async function fetchMartaTrains(): Promise<MartaTrain[]> {
  const apiKey = process.env.MARTA_TRAIN_API_KEY;
  if (!apiKey) {
    console.error('MARTA_TRAIN_API_KEY not configured');
    return [];
  }

  const trainUrl = `${MARTA_TRAIN_BASE}?apiKey=${apiKey}`;
  let fetchUrl = trainUrl;

  if (isRunningInCodespaces()) {
    console.log('Codespaces environment detected. Using proxy for MARTA Train API.');
    fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(trainUrl)}`;
  } else {
    console.log('Using direct connection for MARTA Train API.');
  }

  try {
    const response = await fetch(fetchUrl, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      console.error('MARTA Train API request failed:', response.statusText);
      return [];
    }

    const data = await response.json();

    // Deduplicate trains by TRAIN_ID
    const uniqueTrains = new Map();
    data.forEach((train: any) => {
      if (train.TRAIN_ID && train.LATITUDE && train.LONGITUDE) {
        uniqueTrains.set(train.TRAIN_ID, train);
      }
    });

    const trains: MartaTrain[] = Array.from(uniqueTrains.values()).map((train: any) => ({
      id: train.TRAIN_ID,
      latitude: parseFloat(train.LATITUDE),
      longitude: parseFloat(train.LONGITUDE),
      line: train.LINE || 'Unknown',
      destination: train.DESTINATION || 'Unknown',
    }));

    return trains;
  } catch (error) {
    console.error('Failed to fetch MARTA trains:', error);
    return [];
  }
}
