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
    width: 36,
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
  }}>
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bus body */}
      <rect x="8" y="10" width="32" height="26" rx="3" fill="#FFC107"/>
      <rect x="8" y="10" width="32" height="26" rx="3" stroke="#333" strokeWidth="1.5"/>

      {/* Windshield */}
      <rect x="11" y="14" width="26" height="10" rx="1" fill="#87CEEB" stroke="#333" strokeWidth="1"/>

      {/* Bottom windows/doors */}
      <rect x="11" y="26" width="11" height="8" rx="1" fill="#666"/>
      <rect x="26" y="26" width="11" height="8" rx="1" fill="#666"/>

      {/* Wheels */}
      <circle cx="15" cy="37" r="4" fill="#333" stroke="#666" strokeWidth="1.5"/>
      <circle cx="33" cy="37" r="4" fill="#333" stroke="#666" strokeWidth="1.5"/>
      <circle cx="15" cy="37" r="2" fill="#555"/>
      <circle cx="33" cy="37" r="2" fill="#555"/>

      {/* Headlights */}
      <circle cx="12" cy="35" r="1.5" fill="#FFE082"/>
      <circle cx="36" cy="35" r="1.5" fill="#FFE082"/>
    </svg>
  </div>
);

const TrainIcon = () => (
  <div style={{
    width: 36,
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
  }}>
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Train body */}
      <rect x="10" y="8" width="28" height="30" rx="2" fill="#E53935"/>
      <rect x="10" y="8" width="28" height="30" rx="2" stroke="#333" strokeWidth="1.5"/>

      {/* Front window */}
      <rect x="13" y="11" width="22" height="10" rx="1.5" fill="#87CEEB" stroke="#333" strokeWidth="1"/>

      {/* Side windows */}
      <rect x="13" y="23" width="7" height="6" rx="1" fill="#B3E5FC" stroke="#333" strokeWidth="0.8"/>
      <rect x="21" y="23" width="7" height="6" rx="1" fill="#B3E5FC" stroke="#333" strokeWidth="0.8"/>
      <rect x="29" y="23" width="6" height="6" rx="1" fill="#B3E5FC" stroke="#333" strokeWidth="0.8"/>

      {/* Door line */}
      <line x1="20" y1="23" x2="20" y2="32" stroke="#333" strokeWidth="1"/>

      {/* Wheels/bogies */}
      <rect x="12" y="36" width="8" height="3" rx="1.5" fill="#333"/>
      <rect x="28" y="36" width="8" height="3" rx="1.5" fill="#333"/>

      {/* Front yellow stripe */}
      <rect x="10" y="31" width="28" height="3" fill="#FFD600"/>

      {/* Headlight */}
      <circle cx="24" cy="37" r="1.5" fill="#FFE082"/>
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