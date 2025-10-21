"use client";

import { useEffect, useState } from "react";
import { useMartaData } from "@/hooks/useMartaData";
import { Bus } from "lucide-react";
import { renderToString } from "react-dom/server";

interface TransitMarkersProps {
  map: google.maps.Map | null;
}

const TransitMarkers = ({ map }: TransitMarkersProps) => {
  const { vehicles, isLoading, isError } = useMartaData();
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!map || !vehicles) return;

    // Clear old markers
    markers.forEach((marker) => (marker.map = null));

    const newMarkers = vehicles.map((vehicle) => {
      const iconHtml = renderToString(
        <Bus size={32} color="#FF6B00" />
      );

      const markerDiv = document.createElement("div");
      markerDiv.innerHTML = iconHtml;

      return new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: vehicle.latitude, lng: vehicle.longitude },
        content: markerDiv,
        title: `Bus - Route ${vehicle.route}`,
      });
    });

    setMarkers(newMarkers);

  }, [map, vehicles]);

  if (isLoading) {
    return (
      <div
        aria-live="polite"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md"
      >
        Loading transit data...
      </div>
    );
  }

  if (isError || !vehicles || vehicles.length === 0) {
    return (
      <div
        aria-live="polite"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md"
      >
        No transit data available.
      </div>
    );
  }

  return null;
};

export default TransitMarkers;
