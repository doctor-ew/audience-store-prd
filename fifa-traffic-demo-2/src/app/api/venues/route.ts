import { NextResponse } from 'next/server';
import { getVenues } from '@/lib/data';

export async function GET() {
  const venues = getVenues();
  return NextResponse.json(venues);
}
