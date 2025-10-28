'use client';

import React from 'react';

type MapControlProps = {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
};

const MapControl = ({ onClick, isActive, children }: MapControlProps) => {
  const baseClasses = "absolute top-4 right-4 bg-white p-2 rounded-md shadow-md cursor-pointer hover:bg-gray-100";
  const activeClasses = isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "";

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {children}
    </button>
  );
};

export default MapControl;
