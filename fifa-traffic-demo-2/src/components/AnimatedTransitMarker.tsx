'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';

interface AnimatedTransitMarkerProps {
  position: { lat: number; lng: number };
  type: 'bus' | 'train' | 'venue';
  label?: string;
}

export default function AnimatedTransitMarker({
  position,
  type,
  label,
}: AnimatedTransitMarkerProps) {
  const [currentPosition, setCurrentPosition] = useState(position);
  const previousPositionRef = useRef(position);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Don't animate venue markers
    if (type === 'venue') {
      setCurrentPosition(position);
      return;
    }

    const startPosition = previousPositionRef.current;
    const endPosition = position;

    // Check if position actually changed
    if (
      startPosition.lat === endPosition.lat &&
      startPosition.lng === endPosition.lng
    ) {
      return;
    }

    const startTime = Date.now();
    const duration = 2000; // 2 seconds animation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const interpolatedLat =
        startPosition.lat + (endPosition.lat - startPosition.lat) * easeProgress;
      const interpolatedLng =
        startPosition.lng + (endPosition.lng - startPosition.lng) * easeProgress;

      setCurrentPosition({
        lat: interpolatedLat,
        lng: interpolatedLng,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        previousPositionRef.current = endPosition;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position, type]);

  const getMarkerColor = () => {
    switch (type) {
      case 'bus':
        return '#3B82F6'; // Blue
      case 'train':
        return '#EF4444'; // Red
      case 'venue':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'bus':
        return '🚌';
      case 'train':
        return '🚊';
      case 'venue':
        return '🏟️';
      default:
        return '📍';
    }
  };

  return (
    <AdvancedMarker position={currentPosition} title={label}>
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full text-white text-xl shadow-lg transition-transform hover:scale-110"
          style={{ backgroundColor: getMarkerColor() }}
        >
          {getIcon()}
        </div>
        {label && type === 'venue' && (
          <div className="mt-1 px-2 py-1 bg-white rounded shadow-md text-xs font-semibold">
            {label}
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}
