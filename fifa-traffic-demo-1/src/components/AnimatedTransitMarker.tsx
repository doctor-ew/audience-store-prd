'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { TransitVehicle } from '@/types';

// Custom hook for smooth position animation
const useAnimatedPosition = (lat: number, lng: number, duration = 2000) => {
  const [animatedPosition, setAnimatedPosition] = useState({ lat, lng });
  const previousPositionRef = useRef({ lat, lng });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startPosition = previousPositionRef.current;
    const endPosition = { lat, lng };
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const interpolatedLat = startPosition.lat + (endPosition.lat - startPosition.lat) * progress;
      const interpolatedLng = startPosition.lng + (endPosition.lng - startPosition.lng) * progress;

      setAnimatedPosition({ lat: interpolatedLat, lng: interpolatedLng });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        previousPositionRef.current = endPosition;
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when position changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      previousPositionRef.current = { lat, lng };
    };
  }, [lat, lng, duration]);

  return animatedPosition;
};


const busIcon = (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#FFFFFF" stroke="black" strokeWidth="1.5">
    <path d="M4 17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17Z" />
    <path d="M19 19V21" strokeLinecap="round" />
    <path d="M5 19V21" strokeLinecap="round" />
    <path d="M4 10H20" />
    <path d="M7 5V3" strokeLinecap="round" />
    <path d="M17 5V3" strokeLinecap="round" />
  </svg>
);

const trainIcon = (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#FFFFFF" stroke="black" strokeWidth="1.5">
    <path d="M4 15.5C4 14.9477 4.44772 14.5 5 14.5H19C19.5523 14.5 20 14.9477 20 15.5V18.5C20 19.0523 19.5523 19.5 19 19.5H5C4.44772 19.5 4 19.0523 4 18.5V15.5Z" />
    <path d="M17 19.5V21" strokeLinecap="round" />
    <path d="M7 19.5V21" strokeLinecap="round" />
    <path d="M4.5 14.5V9C4.5 7.34315 5.84315 6 7.5 6H16.5C18.1569 6 19.5 7.34315 19.5 9V14.5" />
    <path d="M8 6V4" strokeLinecap="round" />
    <path d="M16 6V4" strokeLinecap="round" />
    <path d="M8 10H16" />
  </svg>
);

const AnimatedTransitMarker = ({ vehicle }: { vehicle: TransitVehicle }) => {
  const animatedPosition = useAnimatedPosition(vehicle.lat, vehicle.lon);

  return (
    <AdvancedMarker
      position={animatedPosition}
    >
      <div title={`Route: ${vehicle.route} - ${vehicle.type}`}>
        {vehicle.type === 'bus' ? busIcon : trainIcon}
      </div>
    </AdvancedMarker>
  );
};

export default AnimatedTransitMarker;
