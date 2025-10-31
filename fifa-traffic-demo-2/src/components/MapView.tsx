'use client';

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import AnimatedTransitMarker from './AnimatedTransitMarker';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STADIUM_LOCATION = {
  lat: parseFloat(process.env.NEXT_PUBLIC_STADIUM_LAT || '33.754542'),
  lng: parseFloat(process.env.NEXT_PUBLIC_STADIUM_LNG || '-84.402492'),
};

function TrafficLayer({ enabled }: { enabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    // @ts-ignore - Google Maps is loaded by the APIProvider
    if (!window.google) return;

    // @ts-ignore - Google Maps types
    const trafficLayer = new window.google.maps.TrafficLayer();

    if (enabled) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, enabled]);

  return null;
}

export default function MapView() {
  const [showTraffic, setShowTraffic] = useState(true);
  const { data: transitData } = useSWR('/api/transit', fetcher, {
    refreshInterval: 20000, // Refresh every 20 seconds
  });

  const apiKey = process.env.NEXT_PUBLIC_GMAK || '';

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-red-600">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        {/* Traffic Toggle Button - Moved to bottom left to avoid sidebar */}
        <div className="absolute bottom-6 left-4 z-10">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-4 py-2 rounded-lg shadow-lg font-semibold transition-all ${
              showTraffic
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {showTraffic ? '🚦 Traffic: ON' : '🚦 Traffic: OFF'}
          </button>
        </div>

        <Map
          defaultCenter={STADIUM_LOCATION}
          defaultZoom={14}
          mapId="atlanta-fifa-map"
          className="w-full h-full"
        >
          <TrafficLayer enabled={showTraffic} />
        {/* Stadium Marker */}
        <AnimatedTransitMarker
          position={STADIUM_LOCATION}
          type="venue"
          label={process.env.NEXT_PUBLIC_STADIUM_NAME || 'Mercedes-Benz Stadium'}
        />

        {/* Bus markers */}
        {transitData?.buses?.map((bus: any) => (
          <AnimatedTransitMarker
            key={`bus-${bus.id}`}
            position={{ lat: bus.latitude, lng: bus.longitude }}
            type="bus"
            label={`Bus ${bus.route}`}
          />
        ))}

        {/* Train markers */}
        {transitData?.trains?.map((train: any) => (
          <AnimatedTransitMarker
            key={`train-${train.id}`}
            position={{ lat: train.latitude, lng: train.longitude }}
            type="train"
            label={`${train.line} to ${train.destination}`}
          />
        ))}
        </Map>
      </div>
    </APIProvider>
  );
}
