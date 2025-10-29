'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { SpringValue, animated, useSpring } from 'react-spring';
import { FC, memo } from 'react';

interface AnimatedTransitMarkerProps {
  latitude: number;
  longitude: number;
  type: 'bus' | 'train';
}

const BusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V6Z" fill="#FFC107"/>
    <path d="M6 18V20H8V18H6Z" fill="black"/>
    <path d="M16 18V20H18V18H16Z" fill="black"/>
    <path d="M5 8H19V12H5V8Z" fill="white"/>
  </svg>
);

const TrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4H18V16H6V4Z" fill="#F44336"/>
    <path d="M4 16H20V18H4V16Z" fill="#F44336"/>
    <path d="M7 18V20H9V18H7Z" fill="black"/>
    <path d="M15 18V20H17V18H15Z" fill="black"/>
    <path d="M8 6H16V10H8V6Z" fill="white"/>
    <path d="M18 4H20V16H18V4Z" fill="#D32F2F"/>
  </svg>
);

const AnimatedTransitMarker: FC<AnimatedTransitMarkerProps> = memo(({ latitude, longitude, type }) => {
  const springs = useSpring({
    from: { lat: latitude, lng: longitude },
    to: { lat: latitude, lng: longitude },
    config: { duration: 2000 },
  });

  const AnimatedAdvancedMarker = animated(AdvancedMarker);

  return (
    <AnimatedAdvancedMarker
      position={{
        lat: springs.lat as unknown as SpringValue<number>,
        lng: springs.lng as unknown as SpringValue<number>,
      }}
    >
      {type === 'bus' ? <BusIcon /> : <TrainIcon />}
    </AnimatedAdvancedMarker>
  );
});

AnimatedTransitMarker.displayName = 'AnimatedTransitMarker';

export default AnimatedTransitMarker;
