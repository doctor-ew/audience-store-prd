import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'en';

  try {
    const translations = await prisma.translation.findMany({
      where: { locale },
    });

    // Convert to key-value object
    const translationsObj = translations.reduce((acc, t) => {
      acc[t.key] = t.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(translationsObj);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
