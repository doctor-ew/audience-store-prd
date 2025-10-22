"use client";

import { useEffect, useRef } from "react";
import { useMartaData } from "@/hooks/useMartaData";
import { Bus, Train } from "lucide-react";
import { renderToString } from "react-dom/server";

interface TransitMarkersProps {
  map: google.maps.Map | null;
}

const TransitMarkers = ({ map }: TransitMarkersProps) => {
  const { vehicles, isLoading, isError } = useMartaData();
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  useEffect(() => {
    if (!map || !vehicles) return;

    const existingMarkers = markersRef.current;
    const currentVehicleIds = new Set(vehicles.map(v => v.id));

    // Remove markers for vehicles that no longer exist
    existingMarkers.forEach((marker, id) => {
      if (!currentVehicleIds.has(id)) {
        marker.map = null;
        existingMarkers.delete(id);
      }
    });

    // Update or create markers for each vehicle
    vehicles.forEach((vehicle) => {
      const existingMarker = existingMarkers.get(vehicle.id);
      const newPosition = { lat: vehicle.latitude, lng: vehicle.longitude };

      if (existingMarker) {
        // Animate existing marker to new position
        animateMarker(existingMarker, newPosition);
      } else {
        // Create new marker
        const iconHtml = renderToString(
          vehicle.type === "bus"
            ? <Bus size={32} color="#FF6B00" strokeWidth={2} />
            : <Train size={32} color="#0066CC" strokeWidth={2} />
        );

        const markerDiv = document.createElement("div");
        markerDiv.innerHTML = iconHtml;
        markerDiv.style.transition = "transform 1s ease-in-out";

        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: newPosition,
          content: markerDiv,
          title: `${vehicle.type === "bus" ? "Bus" : "Train"} - Route ${vehicle.route}`,
        });

        existingMarkers.set(vehicle.id, newMarker);
      }
    });

  }, [map, vehicles]);

  // Smooth animation function for marker position changes
  const animateMarker = (
    marker: google.maps.marker.AdvancedMarkerElement,
    newPosition: google.maps.LatLngLiteral
  ) => {
    const currentPos = marker.position as google.maps.LatLngLiteral;
    if (!currentPos) {
      marker.position = newPosition;
      return;
    }

    const startLat = currentPos.lat;
    const startLng = currentPos.lng;
    const endLat = newPosition.lat;
    const endLng = newPosition.lng;

    const duration = 1000; // 1 second animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const lat = startLat + (endLat - startLat) * easeProgress;
      const lng = startLng + (endLng - startLng) * easeProgress;

      marker.position = { lat, lng };

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

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
