'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { TransitVehicle } from '@/types';

const TransitMarker = ({ vehicle }: { vehicle: TransitVehicle }) => {
  const isBus = vehicle.type === 'bus';

  return (
    <AdvancedMarker position={{ lat: vehicle.lat, lng: vehicle.lon }}>
      <div
        style={{
          fontSize: isBus ? '24px' : '28px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          transition: 'all 0.5s ease-out',
          cursor: 'pointer',
        }}
        title={`${vehicle.type.toUpperCase()} - Route: ${vehicle.route}`}
      >
        {isBus ? '🚌' : '🚊'}
      </div>
    </AdvancedMarker>
  );
};

export default TransitMarker;
