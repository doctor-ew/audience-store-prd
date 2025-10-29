import { NextResponse } from 'next/server';
import { fetchBusData, fetchTrainData } from '@/lib/marta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [buses, trains] = await Promise.all([
      fetchBusData(),
      fetchTrainData(),
    ]);

    return NextResponse.json({
      buses,
      trains,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Transit API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transit data' },
      { status: 500 }
    );
  }
}
