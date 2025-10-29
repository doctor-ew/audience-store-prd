'use client';

import { Locale } from './i18n';

export type UserPreferences = {
  language: Locale;
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
