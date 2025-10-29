'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { useSpring } from 'react-spring';
import { FC, memo, useEffect, useState, useRef } from 'react';

interface AnimatedTransitMarkerProps {
  latitude: number;
  longitude: number;
  type: 'bus' | 'train';
}

const BusIcon = () => (
  <div style={{
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#FFC107',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V6Z" fill="black"/>
      <path d="M5 8H19V12H5V8Z" fill="white"/>
    </svg>
  </div>
);

const TrainIcon = () => (
  <div style={{
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#F44336',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4H18V16H6V4Z" fill="black"/>
      <path d="M8 6H16V10H8V6Z" fill="white"/>
    </svg>
  </div>
);

const AnimatedTransitMarker: FC<AnimatedTransitMarkerProps> = memo(({ latitude, longitude, type }) => {
  const isFirstRender = useRef(true);
  const [position, setPosition] = useState({ lat: latitude, lng: longitude });

  const [, api] = useSpring(() => ({
    lat: latitude,
    lng: longitude,
    config: { tension: 280, friction: 60 },
    onChange: (result) => {
      // Ensure we're passing actual numbers, not spring values
      const lat = result.value.lat;
      const lng = result.value.lng;
      setPosition({
        lat: typeof lat === 'number' ? lat : parseFloat(String(lat)),
        lng: typeof lng === 'number' ? lng : parseFloat(String(lng))
      });
    }
  }));

  useEffect(() => {
    // Skip animation on first render to avoid jumping
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setPosition({ lat: latitude, lng: longitude });
      return;
    }

    // Animate to new position
    api.start({
      lat: latitude,
      lng: longitude,
    });
  }, [latitude, longitude, api]);

  return (
    <AdvancedMarker position={position}>
      {type === 'bus' ? <BusIcon /> : <TrainIcon />}
    </AdvancedMarker>
  );
});

AnimatedTransitMarker.displayName = 'AnimatedTransitMarker';

export default AnimatedTransitMarker;