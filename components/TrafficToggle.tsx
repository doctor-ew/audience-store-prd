"use client";

import { Car } from "lucide-react";

interface TrafficToggleProps {
  isTrafficVisible: boolean;
  onToggle: () => void;
}

const TrafficToggle = ({
  isTrafficVisible,
  onToggle,
}: TrafficToggleProps) => {
  return (
    <button
      onClick={onToggle}
      aria-pressed={isTrafficVisible}
      aria-label="Toggle traffic layer visibility"
      className="absolute top-4 right-4 z-10 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stadium-navy"
    >
      <Car
        className={`h-6 w-6 ${
          isTrafficVisible ? "text-stadium-red" : "text-stadium-navy"
        }`}
      />
    </button>
  );
};

export default TrafficToggle;
