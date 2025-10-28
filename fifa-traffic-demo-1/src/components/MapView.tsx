'use client';

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import useSWR from 'swr';
import { TransitVehicle } from '@/types';
import VenueMarker from './VenueMarker';
import MapControl from './MapControl';
import AnimatedTransitMarker from './AnimatedTransitMarker';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// A child component to access the map instance
const TrafficLayer = ({ showTraffic }: { showTraffic: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const trafficLayer = new google.maps.TrafficLayer();
    if (showTraffic) {
      trafficLayer.setMap(map);
    }

    // Cleanup function to remove the layer when the component unmounts or state changes
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, showTraffic]);

  return null;
};

const MapView = () => {
  const [showTraffic, setShowTraffic] = useState(false);
  const { data, error } = useSWR('/api/transit', fetcher, { refreshInterval: 20000 });

  const position = {
    lat: parseFloat(process.env.NEXT_PUBLIC_MAP_LAT || '33.7490'),
    lng: parseFloat(process.env.NEXT_PUBLIC_MAP_LNG || '-84.3880'),
  };
  const stadiumPosition = { lat: 33.7555, lng: -84.4008 };

  if (error) console.error("SWR Error:", error);

  const allVehicles: TransitVehicle[] = data ? [...data.buses, ...data.trains] : [];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAK!}>
      <div className="h-full w-full relative">
        <Map
          defaultCenter={position}
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
          {/* Soccer ball icon for the toggle */}
          ⚽️
        </MapControl>
      </div>
    </APIProvider>
  );
};

export default MapView;
