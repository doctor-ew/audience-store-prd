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
    let isMounted = true;

    const initMap = async () => {
      // Wait for the ref to be available
      if (!mapRef.current) {
        console.log("Waiting for mapRef...");
        setTimeout(() => {
          if (isMounted && !map) {
            initMap();
          }
        }, 100);
        return;
      }

      if (map) {
        return; // Already initialized
      }

      try {
        console.log("Starting map initialization...");
        console.log("API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Present" : "Missing");

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
          mapId: "MERCEDES_BENZ_STADIUM_MAP",
        };

        if (isMounted && mapRef.current) {
          const newMap = new Map(mapRef.current, mapOptions);
          console.log("Map created successfully!");
          setMap(newMap);
          setLoading(false);
        }
      } catch (e) {
        console.error("Map initialization error:", e);
        if (isMounted) {
          setError(e as Error);
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
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

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {loading && (
        <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <p className="text-gray-600">Loading map...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 w-full h-full bg-red-100 text-red-700 flex items-center justify-center z-10">
          Error loading map: {error.message}
        </div>
      )}

      <div
        className="w-full h-full min-h-[500px]"
        ref={mapRef}
        data-testid="map-container"
      />
      {map && <TransitMarkers map={map} />}
    </div>
  );
};

export default Map;
