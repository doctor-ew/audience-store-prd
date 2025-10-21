import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TransitVehicle } from "@/lib/types";

// Zod schema for validating the MARTA API response
const MartaVehicleSchema = z.object({
  VEHICLE: z.string(),
  LATITUDE: z.string(),
  LONGITUDE: z.string(),
  ROUTE: z.string(),
});

const MartaResponseSchema = z.array(MartaVehicleSchema);

export async function GET(request: NextRequest) {
  const apiKey = process.env.MARTA_API_KEY;

  if (!apiKey) {
    console.error("MARTA_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Application is not configured correctly." },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 400);

  try {
    const response = await fetch(
      `https://developerservices.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus`,
      {
        signal: controller.signal,
        headers: {
          "api-key": apiKey,
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`MARTA API failed with status: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch data from MARTA API." },
        { status: 503 }
      );
    }

    const data = await response.json();
    const parsedData = MartaResponseSchema.safeParse(data);

    if (!parsedData.success) {
      console.error("Invalid data structure from MARTA API:", parsedData.error);
      return NextResponse.json(
        { error: "Invalid data from MARTA API." },
        { status: 503 }
      );
    }

    const vehicles: TransitVehicle[] = parsedData.data.map((vehicle) => ({
      id: vehicle.VEHICLE,
      type: "bus",
      latitude: parseFloat(vehicle.LATITUDE),
      longitude: parseFloat(vehicle.LONGITUDE),
      route: vehicle.ROUTE,
    }));

    return NextResponse.json({ vehicles });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("MARTA API request timed out.");
      return NextResponse.json(
        { error: "MARTA API request timed out." },
        { status: 503 }
      );
    }
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
