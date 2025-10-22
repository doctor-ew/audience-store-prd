import { NextRequest, NextResponse } from "next/server";
import { TransitVehicle } from "@/lib/types";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

// Mock data for demonstration when MARTA API is down
const MOCK_MARTA_DATA = [
  { VEHICLE: "BUS001", LATITUDE: "33.755", LONGITUDE: "-84.405", ROUTE: "1" },
  { VEHICLE: "BUS002", LATITUDE: "33.752", LONGITUDE: "-84.400", ROUTE: "2" },
  { VEHICLE: "BUS003", LATITUDE: "33.758", LONGITUDE: "-84.410", ROUTE: "3" },
  { VEHICLE: "BUS004", LATITUDE: "33.750", LONGITUDE: "-84.395", ROUTE: "4" },
  { VEHICLE: "BUS005", LATITUDE: "33.760", LONGITUDE: "-84.408", ROUTE: "5" },
];

export async function GET() {
  const useMockData = process.env.USE_MOCK_MARTA_DATA === "true";

  // If mock data is enabled, return it immediately
  if (useMockData) {
    console.log("Using mock MARTA data for demonstration");
    const vehicles: TransitVehicle[] = MOCK_MARTA_DATA.map((vehicle) => ({
      id: vehicle.VEHICLE,
      type: "bus",
      latitude: parseFloat(vehicle.LATITUDE),
      longitude: parseFloat(vehicle.LONGITUDE),
      route: vehicle.ROUTE,
    }));
    return NextResponse.json({ vehicles });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    console.log("Fetching MARTA GTFS-RT data...");
    const response = await fetch(
      "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb",
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`MARTA GTFS-RT API failed with status: ${response.status}`);
      console.log("Falling back to mock data");
      const vehicles: TransitVehicle[] = MOCK_MARTA_DATA.map((vehicle) => ({
        id: vehicle.VEHICLE,
        type: "bus",
        latitude: parseFloat(vehicle.LATITUDE),
        longitude: parseFloat(vehicle.LONGITUDE),
        route: vehicle.ROUTE,
      }));
      return NextResponse.json({ vehicles });
    }

    // Parse the protocol buffer data
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    console.log(`Received ${feed.entity.length} vehicle positions from MARTA`);

    // Convert GTFS-RT data to our format
    const vehicles: TransitVehicle[] = feed.entity
      .filter((entity) => entity.vehicle?.position)
      .map((entity) => {
        const vehicle = entity.vehicle!;
        const position = vehicle.position!;

        return {
          id: vehicle.vehicle?.id || entity.id,
          type: "bus" as const,
          latitude: position.latitude || 0,
          longitude: position.longitude || 0,
          route: vehicle.trip?.routeId || "Unknown",
        };
      })
      .filter((v) => v.latitude !== 0 && v.longitude !== 0); // Filter out invalid positions

    console.log(`Returning ${vehicles.length} valid bus positions`);
    return NextResponse.json({ vehicles });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("MARTA GTFS-RT API request timed out.");
      console.log("Falling back to mock data");
      const vehicles: TransitVehicle[] = MOCK_MARTA_DATA.map((vehicle) => ({
        id: vehicle.VEHICLE,
        type: "bus",
        latitude: parseFloat(vehicle.LATITUDE),
        longitude: parseFloat(vehicle.LONGITUDE),
        route: vehicle.ROUTE,
      }));
      return NextResponse.json({ vehicles });
    }
    console.error("An unexpected error occurred:", error);
    console.log("Falling back to mock data");
    const vehicles: TransitVehicle[] = MOCK_MARTA_DATA.map((vehicle) => ({
      id: vehicle.VEHICLE,
      type: "bus",
      latitude: parseFloat(vehicle.LATITUDE),
      longitude: parseFloat(vehicle.LONGITUDE),
      route: vehicle.ROUTE,
    }));
    return NextResponse.json({ vehicles });
  }
}
