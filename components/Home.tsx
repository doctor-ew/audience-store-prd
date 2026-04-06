"use client";

import { Suspense, useState } from "react";
import Map from "@/components/Map";
import TrafficToggle from "@/components/TrafficToggle";

export default function Home() {
  const [isTrafficVisible, setIsTrafficVisible] = useState(false);

  const toggleTrafficVisibility = () => {
    setIsTrafficVisible((prev) => !prev);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center text-stadium-navy">
          Atlanta FIFA Navigator
        </h1>
      </div>

      <div className="w-full mt-8 relative">
        <TrafficToggle
          isTrafficVisible={isTrafficVisible}
          onToggle={toggleTrafficVisibility}
        />
        <Suspense fallback={<div className="w-full min-h-[500px] bg-gray-200 animate-pulse"></div>}>
          <Map isTrafficVisible={isTrafficVisible} />
        </Suspense>
      </div>
    </main>
  );
}
