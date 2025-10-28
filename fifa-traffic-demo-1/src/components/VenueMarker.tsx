'use client';

import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

type VenueMarkerProps = {
  lat: number;
  lng: number;
};

const VenueMarker = ({ lat, lng }: VenueMarkerProps) => {
  return (
    <AdvancedMarker position={{ lat, lng }}>
      <img src="/assets/stadium-icon.svg" alt="Stadium" width="32" height="32" />
    </AdvancedMarker>
  );
};

export default VenueMarker;
