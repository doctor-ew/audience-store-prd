'use client';

import { useEffect, useState, useRef } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { TransitVehicle } from '@/types';

const AnimatedTransitMarker = ({ vehicle }: { vehicle: TransitVehicle }) => {
  const isBus = vehicle.type === 'bus';
  const [currentPos, setCurrentPos] = useState({ lat: vehicle.lat, lng: vehicle.lon });
  const prevPosRef = useRef({ lat: vehicle.lat, lng: vehicle.lon });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // When vehicle position changes, animate from old to new position
    const startPos = prevPosRef.current;
    const endPos = { lat: vehicle.lat, lng: vehicle.lon };

    // Check if position actually changed
    if (startPos.lat === endPos.lat && startPos.lng === endPos.lng) {
      return;
    }

    const duration = 1000; // 1 second animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const lat = startPos.lat + (endPos.lat - startPos.lat) * eased;
      const lng = startPos.lng + (endPos.lng - startPos.lng) * eased;

      setCurrentPos({ lat, lng });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevPosRef.current = endPos;
      }
    };

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vehicle.lat, vehicle.lon]);

  return (
    <AdvancedMarker position={currentPos}>
      <div
        style={{
          fontSize: isBus ? '24px' : '28px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          cursor: 'pointer',
          transform: 'translate(-50%, -50%)',
        }}
        title={`${vehicle.type.toUpperCase()} - Route: ${vehicle.route}`}
      >
        {isBus ? '🚌' : '🚊'}
      </div>
    </AdvancedMarker>
  );
};

export default AnimatedTransitMarker;
