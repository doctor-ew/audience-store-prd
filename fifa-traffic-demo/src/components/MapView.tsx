'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import useSWR from 'swr';
import { TransitVehicle } from '@/types';
import VenueMarker from './VenueMarker';
import MapControl from './MapControl';
import AnimatedTransitMarker from './AnimatedTransitMarker';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Traffic layer component
const TrafficLayer = ({ showTraffic }: { showTraffic: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const trafficLayer = new google.maps.TrafficLayer();
    if (showTraffic) {
      trafficLayer.setMap(map);
    }

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, showTraffic]);

  return null;
};

const MapView = () => {
  const [showTraffic, setShowTraffic] = useState(false);
  const [showDebug, setShowDebug] = useState(true); // Show debug by default

  // Fetch transit data with auto-refresh every 20 seconds
  const { data, error, isLoading } = useSWR('/api/transit', fetcher, {
    refreshInterval: 20000,
    revalidateOnFocus: false,
  });

  // Get stadium coordinates from environment variables
  const stadiumLat = parseFloat(process.env.NEXT_PUBLIC_STADIUM_LAT || '33.754542');
  const stadiumLng = parseFloat(process.env.NEXT_PUBLIC_STADIUM_LNG || '-84.402492');

  const stadiumPosition = { lat: stadiumLat, lng: stadiumLng };
  const apiKey = process.env.NEXT_PUBLIC_GMAK || '';

  if (error) console.error('SWR Error:', error);

  const buses: TransitVehicle[] = data?.buses || [];
  const trains: TransitVehicle[] = data?.trains || [];
  const allVehicles: TransitVehicle[] = [...buses, ...trains];

  // Debug: Log first train to see coordinates
  if (trains.length > 0 && typeof window !== 'undefined') {
    console.log('First train:', trains[0]);
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-full w-full relative">
        <Map
          defaultCenter={stadiumPosition}
          defaultZoom={14}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="fifa-map-style"
        >
          <VenueMarker lat={stadiumPosition.lat} lng={stadiumPosition.lng} />
          <TrafficLayer showTraffic={showTraffic} />
          {allVehicles.map((vehicle) => (
            <AnimatedTransitMarker key={vehicle.id} vehicle={vehicle} />
          ))}
        </Map>

        <MapControl onClick={() => setShowTraffic(!showTraffic)} isActive={showTraffic}>
          🚦
        </MapControl>

        {/* Debug overlay */}
        {showDebug && (
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-md text-xs z-50 max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Debug Info</span>
              <button
                onClick={() => setShowDebug(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <div>Maps API Key: {apiKey ? '✓ Loaded' : '✗ Missing'}</div>
              <div>Stadium: {stadiumLat.toFixed(4)}, {stadiumLng.toFixed(4)}</div>
              <div>Transit API Status: {isLoading ? '⏳ Loading...' : error ? '✗ Error' : '✓ Connected'}</div>
              <div>Buses: {buses.length} | Trains: {trains.length}</div>
              <div>Total Markers: {allVehicles.length}</div>
              <div className="text-gray-400 text-[10px] mt-2">
                Auto-refresh: 20s | Next: {isLoading ? 'now' : 'pending'}
              </div>
            </div>
          </div>
        )}
      </div>
    </APIProvider>
  );
};

export default MapView;
