/**
 * Hyperlocal Geolocation & Multi-Region Panchayat Matcher
 * Supports GPS auto-detection (navigator.geolocation) and Haversine nearest-zone mapping
 * across multiple agricultural regions in India.
 */

import { PanchayatInfo } from '../contexts/FarmContext';

export interface GeoDetectionResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  nearestPanchayat?: PanchayatInfo;
  distanceKm?: number;
  detectedPlaceName?: string;
  errorMessage?: string;
}

/**
 * Great-circle distance between two points in km (Haversine formula)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Find the closest panchayat from the catalog to the user's coordinates
 */
export function findNearestPanchayat(
  lat: number,
  lon: number,
  catalog: PanchayatInfo[]
): { panchayat: PanchayatInfo; distanceKm: number } {
  let closest = catalog[0];
  let minDistance = Infinity;

  for (const p of catalog) {
    const dist = calculateHaversineDistanceKm(lat, lon, p.lat, p.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = p;
    }
  }

  return { panchayat: closest, distanceKm: minDistance };
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim with fast fallback
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'MausamSetu-FarmerPlatform/1.0'
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const village = addr.village || addr.suburb || addr.town || addr.city || addr.county;
      const state = addr.state;
      if (village && state) return `${village}, ${state}`;
      if (village) return village;
      if (data.display_name) return data.display_name.split(',').slice(0, 2).join(',');
    }
  } catch {
    // Network or rate-limit failure - graceful fallback
  }
  return undefined;
}

/**
 * Trigger GPS auto-detection using browser geolocation API
 */
export async function detectUserLocation(
  catalog: PanchayatInfo[]
): Promise<GeoDetectionResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      errorMessage: 'Geolocation is not supported by your browser.'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const { panchayat, distanceKm } = findNearestPanchayat(lat, lon, catalog);
        const detectedPlaceName = await reverseGeocode(lat, lon);

        resolve({
          success: true,
          latitude: lat,
          longitude: lon,
          nearestPanchayat: panchayat,
          distanceKm,
          detectedPlaceName: detectedPlaceName || `${panchayat.name} Region`
        });
      },
      (err) => {
        let msg = 'Unable to retrieve your location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        resolve({
          success: false,
          errorMessage: msg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });
}
