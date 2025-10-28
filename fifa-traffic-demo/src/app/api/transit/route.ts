import { NextResponse } from 'next/server';
import { fetchBusData, fetchTrainData } from '@/lib/marta';

export async function GET() {
  try {
    // Fetch both in parallel for efficiency
    const [buses, trains] = await Promise.all([
      fetchBusData(),
      fetchTrainData(),
    ]);

    return NextResponse.json({ buses, trains });
  } catch (error) {
    console.error('Error in /api/transit:', error);
    return NextResponse.json({ error: 'Failed to fetch transit data' }, { status: 500 });
  }
}
