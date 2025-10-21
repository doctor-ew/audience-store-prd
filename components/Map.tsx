"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import TransitMarkers from "./TransitMarkers";

interface MapProps {
  isTrafficVisible: boolean;
}

const Map = ({ isTrafficVisible }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const trafficLayer = useRef<google.maps.TrafficLayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
        });

        const { Map } = await loader.importLibrary("maps");
        await loader.importLibrary("marker");

        const mapOptions: google.maps.MapOptions = {
          center: {
            lat: 33.754542,
            lng: -84.402492,
          },
          zoom: 15,
          mapId: "MERCEDES_BENZ_STADIUM_MAP", // Replace with your Map ID
        };

        if (mapRef.current) {
          const newMap = new Map(mapRef.current, mapOptions);
          setMap(newMap);
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!map) {
      initMap();
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (isTrafficVisible) {
      if (!trafficLayer.current) {
        trafficLayer.current = new google.maps.TrafficLayer();
      }
      trafficLayer.current.setMap(map);
    } else {
      if (trafficLayer.current) {
        trafficLayer.current.setMap(null);
      }
    }
  }, [isTrafficVisible, map]);

  if (loading) {
    return <div className="w-full min-h-[500px] bg-gray-200 animate-pulse"></div>;
  }

  if (error) {
    return (
      <div className="w-full min-h-[500px] bg-red-100 text-red-700 flex items-center justify-center">
        Error loading map: {error.message}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full min-h-[500px]"
        ref={mapRef}
        data-testid="map-container"
      />
      {/* <TransitMarkers map={map} /> */}
    </div>
  );
};

export default Map;
