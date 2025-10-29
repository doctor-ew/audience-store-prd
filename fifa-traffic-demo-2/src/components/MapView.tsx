'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ATLANTA_CENTER = { lat: 33.7490, lng: -84.3880 };

// Dynamically import the AnimatedTransitMarker with SSR disabled
const AnimatedTransitMarker = dynamic(() => import('./AnimatedTransitMarker'), {
  ssr: false,
});

export default function MapView() {
  const { data: transitData } = useSWR('/api/transit', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAK || ''}>
      <Map
        defaultCenter={ATLANTA_CENTER}
        defaultZoom={12}
        mapId="atlanta-fifa-map"
      >
        {/* Venue markers */}
        <Marker position={{ lat: 33.755487, lng: -84.400993 }} />

        {/* Bus markers */}
        {transitData?.buses?.map((bus: any) => (
          <AnimatedTransitMarker
            key={bus.id}
            latitude={bus.lat}
            longitude={bus.lon}
            type="bus"
          />
        ))}

        {/* Train markers */}
        {transitData?.trains?.map((train: any) => (
          <AnimatedTransitMarker
            key={train.id}
            latitude={train.lat}
            longitude={train.lon}
            type="train"
          />
        ))}
      </Map>
    </APIProvider>
  );
}
