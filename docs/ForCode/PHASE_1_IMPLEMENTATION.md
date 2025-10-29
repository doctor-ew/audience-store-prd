# Phase 1 Implementation Guide - No Database

> **For**: Claude Code (Engineer Agent)
> **Phase**: 1 (MVP - Maps + MARTA)
> **Timeline**: 3-5 days
> **Goal**: Deploy working app without database complexity

## Overview

This guide provides step-by-step instructions for implementing Phase 1 of the Atlanta FIFA Navigator. **No database, no Prisma, no migrations.** All data is static or client-side.

## Key Principles

1. **No Database**: Do not install Prisma, do not create schema.prisma
2. **Static Data**: Events and venues stored in JSON files
3. **Client Storage**: Use localStorage for user preferences
4. **Fast Deployment**: Zero database configuration on Vercel

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Google Maps API key
- MARTA API keys
- Vercel account (for deployment)

## Implementation Steps

### Step 1: Initialize Next.js Project

```bash
# Create Next.js app
pnpx create-next-app@latest fifa-traffic-demo-1 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd fifa-traffic-demo-1
```

### Step 2: Install Dependencies

```bash
# Google Maps
pnpm add @vis.gl/react-google-maps

# MARTA GTFS Real-time
pnpm add gtfs-realtime-bindings

# Data fetching
pnpm add swr

# No Prisma, no database packages!
```

### Step 3: Environment Variables

Create `.env.local`:

```bash
# Google Maps API
NEXT_PUBLIC_GMAK=your_google_maps_api_key

# MARTA APIs
MARTA_API_KEY=your_marta_bus_api_key
MARTA_TRAIN_API_KEY=your_marta_train_api_key

# Optional
USE_MOCK_MARTA_DATA=false
```

Create `.env.example`:

```bash
NEXT_PUBLIC_GMAK=your_google_maps_api_key_here
MARTA_API_KEY=your_marta_bus_api_key_here
MARTA_TRAIN_API_KEY=your_marta_train_api_key_here
USE_MOCK_MARTA_DATA=false
```

### Step 4: Create Static Data Files

#### src/data/events.json

```json
[
  {
    "id": "fifa-2026-atl-001",
    "fifaEventId": "FIFA2026-ATL-001",
    "name": "FIFA World Cup 2026 - Opening Match",
    "description": "The opening match of FIFA World Cup 2026 in Atlanta",
    "startTime": "2026-06-11T19:00:00Z",
    "venueId": "venue-mbs"
  },
  {
    "id": "fifa-2026-atl-002",
    "fifaEventId": "FIFA2026-ATL-002",
    "name": "FIFA World Cup 2026 - Group Stage Match 2",
    "description": "Second group stage match at Mercedes-Benz Stadium",
    "startTime": "2026-06-15T16:00:00Z",
    "venueId": "venue-mbs"
  }
]
```

#### src/data/venues.json

```json
[
  {
    "id": "venue-mbs",
    "name": "Mercedes-Benz Stadium",
    "address": "1 AMB Drive NW, Atlanta, GA 30313",
    "latitude": 33.755487,
    "longitude": -84.400993,
    "amenities": ["Restrooms", "Concessions", "Accessibility", "WiFi"]
  }
]
```

#### src/data/translations/en.json

```json
{
  "app.title": "Atlanta FIFA Navigator",
  "map.title": "Transit Map",
  "events.title": "Upcoming Events",
  "transit.bus": "Bus",
  "transit.train": "Train",
  "language.switch": "Switch Language"
}
```

#### src/data/translations/es.json

```json
{
  "app.title": "Navegador FIFA de Atlanta",
  "map.title": "Mapa de Tránsito",
  "events.title": "Próximos Eventos",
  "transit.bus": "Autobús",
  "transit.train": "Tren",
  "language.switch": "Cambiar Idioma"
}
```

### Step 5: Create Utility Functions

#### src/lib/data.ts

```typescript
import eventsData from '@/data/events.json';
import venuesData from '@/data/venues.json';

export interface Event {
  id: string;
  fifaEventId: string;
  name: string;
  description: string;
  startTime: string;
  venueId: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
}

export function getEvents(): Event[] {
  return eventsData;
}

export function getVenues(): Venue[] {
  return venuesData;
}

export function getVenueById(id: string): Venue | undefined {
  return venuesData.find(v => v.id === id);
}

export function getEventsByVenueId(venueId: string): Event[] {
  return eventsData.filter(e => e.venueId === venueId);
}
```

#### src/lib/i18n.ts

```typescript
import enTranslations from '@/data/translations/en.json';
import esTranslations from '@/data/translations/es.json';

export type Locale = 'en' | 'es';

const translations: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations,
};

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.en;
}

export function translate(key: string, locale: Locale): string {
  return translations[locale]?.[key] || key;
}
```

#### src/lib/storage.ts (Client-side only)

```typescript
'use client';

export type UserPreferences = {
  language: 'en' | 'es';
  favoriteVenues: string[];
};

const STORAGE_KEY = 'atlanta-fifa-prefs';

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return { language: 'en', favoriteVenues: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load preferences:', e);
  }

  return { language: 'en', favoriteVenues: [] };
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
}

export function toggleFavoriteVenue(venueId: string): void {
  const prefs = getUserPreferences();
  const index = prefs.favoriteVenues.indexOf(venueId);

  if (index > -1) {
    prefs.favoriteVenues.splice(index, 1);
  } else {
    prefs.favoriteVenues.push(venueId);
  }

  saveUserPreferences(prefs);
}

export function isFavoriteVenue(venueId: string): boolean {
  const prefs = getUserPreferences();
  return prefs.favoriteVenues.includes(venueId);
}
```

#### src/lib/codespaces.ts

```typescript
export function isRunningInCodespaces(): boolean {
  return (
    process.env.CODESPACES === 'true' ||
    !!process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  );
}
```

### Step 6: MARTA API Integration

#### src/lib/marta.ts

```typescript
import { isRunningInCodespaces } from './codespaces';
import gtfsRealtimeBindings from 'gtfs-realtime-bindings';

const MARTA_BUS_URL = 'https://gtfs-rt.itsmarta.com/vehicles/vehiclepositions.pb';
const MARTA_TRAIN_BASE = 'https://developerservices.itsmarta.com:18096/restservice/railrealtimearrivals/getalltrainarrivals';

export interface MartaBus {
  id: string;
  latitude: number;
  longitude: number;
  route: string;
}

export interface MartaTrain {
  id: string;
  latitude: number;
  longitude: number;
  line: string;
  destination: string;
}

export async function fetchMartaBuses(): Promise<MartaBus[]> {
  const apiKey = process.env.MARTA_API_KEY;
  if (!apiKey) {
    console.error('MARTA_API_KEY not configured');
    return [];
  }

  try {
    const response = await fetch(`${MARTA_BUS_URL}?apiKey=${apiKey}`);
    const buffer = await response.arrayBuffer();
    const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    return feed.entity
      .filter(entity => entity.vehicle?.position)
      .map(entity => ({
        id: entity.vehicle!.vehicle!.id || '',
        latitude: entity.vehicle!.position!.latitude!,
        longitude: entity.vehicle!.position!.longitude!,
        route: entity.vehicle!.trip?.routeId || 'Unknown',
      }));
  } catch (error) {
    console.error('Failed to fetch MARTA buses:', error);
    return [];
  }
}

export async function fetchMartaTrains(): Promise<MartaTrain[]> {
  const apiKey = process.env.MARTA_TRAIN_API_KEY;
  if (!apiKey) {
    console.error('MARTA_TRAIN_API_KEY not configured');
    return [];
  }

  const trainUrl = `${MARTA_TRAIN_BASE}?apiKey=${apiKey}`;
  const fetchUrl = isRunningInCodespaces()
    ? `https://api.allorigins.win/raw?url=${encodeURIComponent(trainUrl)}`
    : trainUrl;

  try {
    const response = await fetch(fetchUrl);
    const data = await response.json();

    // Transform MARTA train data to our format
    // Note: Actual implementation depends on MARTA API response structure
    return data.map((train: any) => ({
      id: train.TRAIN_ID || '',
      latitude: parseFloat(train.LATITUDE) || 0,
      longitude: parseFloat(train.LONGITUDE) || 0,
      line: train.LINE || 'Unknown',
      destination: train.DESTINATION || 'Unknown',
    }));
  } catch (error) {
    console.error('Failed to fetch MARTA trains:', error);
    return [];
  }
}
```

### Step 7: API Routes

#### src/app/api/transit/route.ts

```typescript
import { NextResponse } from 'next/server';
import { fetchMartaBuses, fetchMartaTrains } from '@/lib/marta';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [buses, trains] = await Promise.allSettled([
      fetchMartaBuses(),
      fetchMartaTrains(),
    ]);

    return NextResponse.json({
      buses: buses.status === 'fulfilled' ? buses.value : [],
      trains: trains.status === 'fulfilled' ? trains.value : [],
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
```

#### src/app/api/events/route.ts

```typescript
import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/data';

export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}
```

#### src/app/api/venues/route.ts

```typescript
import { NextResponse } from 'next/server';
import { getVenues } from '@/lib/data';

export async function GET() {
  const venues = getVenues();
  return NextResponse.json(venues);
}
```

### Step 8: Components

#### src/components/MapView.tsx

```typescript
'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ATLANTA_CENTER = { lat: 33.7490, lng: -84.3880 };

export default function MapView() {
  const { data: transitData } = useSWR('/api/transit', fetcher, {
    refreshInterval: 20000, // Refresh every 20 seconds
  });

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAK || ''}>
      <Map
        defaultCenter={ATLANTA_CENTER}
        defaultZoom={12}
        mapId="atlanta-fifa-map"
      >
        {/* Venue markers */}
        <Marker position={{ lat: 33.755487, lng: -84.400993 }} />

        {/* Bus markers */}
        {transitData?.buses?.map((bus: any) => (
          <Marker
            key={bus.id}
            position={{ lat: bus.latitude, lng: bus.longitude }}
          />
        ))}

        {/* Train markers */}
        {transitData?.trains?.map((train: any) => (
          <Marker
            key={train.id}
            position={{ lat: train.latitude, lng: train.longitude }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
```

#### src/components/LanguageSwitcher.tsx

```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const prefs = getUserPreferences();
    const newLang = prefs.language === 'en' ? 'es' : 'en';

    prefs.language = newLang;
    saveUserPreferences(prefs);

    // Navigate to new language route
    const newPath = pathname.replace(/^\/(en|es)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {getUserPreferences().language === 'en' ? 'ES' : 'EN'}
    </button>
  );
}
```

### Step 9: Main Page

#### src/app/[lang]/page.tsx

```typescript
import MapView from '@/components/MapView';
import { getEvents } from '@/lib/data';
import { getTranslations, Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const events = getEvents();
  const t = getTranslations(lang);

  return (
    <main className="h-screen w-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white">
        <h1>{t['app.title']}</h1>
      </header>
      <div className="flex-1 flex">
        <div className="flex-1">
          <MapView />
        </div>
        <aside className="w-80 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{t['events.title']}</h2>
          <ul>
            {events.map((event) => (
              <li key={event.id} className="mb-4">
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
```

### Step 10: Configure Next.js

#### next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // No special webpack config needed for Phase 1
};

export default nextConfig;
```

### Step 11: Update package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Step 12: Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -D vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## Testing Checklist

- [ ] Map loads and displays Atlanta
- [ ] Venue marker appears for Mercedes-Benz Stadium
- [ ] MARTA buses appear and update every 20 seconds
- [ ] MARTA trains appear (with Codespaces proxy if needed)
- [ ] Events list displays correctly
- [ ] Language switcher toggles between EN/ES
- [ ] Language preference persists in localStorage
- [ ] Favorite venues toggle works (stored in localStorage)
- [ ] Works on mobile devices
- [ ] Builds successfully: `pnpm run build`
- [ ] Deploys to Vercel without errors

## What NOT to Do

- ❌ Do NOT install Prisma
- ❌ Do NOT create prisma/schema.prisma
- ❌ Do NOT add database connection strings
- ❌ Do NOT create API routes for user profiles
- ❌ Do NOT attempt server-side user authentication
- ❌ Do NOT add migration scripts

## Next Steps (Phase 2)

After Phase 1 is deployed and validated, see:
- `docs/ForCode/SETUP_DATABASE_FOR_VERCEL.md` for Phase 2 implementation
- `docs/PHASED_APPROACH.md` for migration strategy

---

**Phase**: 1 (MVP)
**Status**: Active
**Next Phase**: After successful deployment + user validation
