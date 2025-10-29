'use client';

import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { useTranslation } from '@/contexts/TranslationContext';

type VenueMarkerProps = {
  lat: number;
  lng: number;
};

const VenueMarker = ({ lat, lng }: VenueMarkerProps) => {
  const { t } = useTranslation();

  return (
    <AdvancedMarker position={{ lat, lng }}>
      <img src="/assets/stadium-icon.svg" alt={t('stadium')} width="32" height="32" />
    </AdvancedMarker>
  );
};

export default VenueMarker;
