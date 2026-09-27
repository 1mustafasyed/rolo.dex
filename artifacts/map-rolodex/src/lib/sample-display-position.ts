import type { MapContact } from './types';

export type LngLat = [longitude: number, latitude: number];

// Conservative interior disks derived from OSM administrative polygons, NOT full city
// outlines. Each radius is at most half the measured distance from its center to
// the nearest polygon edge (including holes); details and provenance are documented
// in SAMPLE_BOUNDARIES.md. Cities without a reliable match retain their center pin.
const interiors: Record<string, { center: LngLat; radiusMeters: number }> = {
  'Stockholm|SE': { center: [18.033341, 59.300523], radiusMeters: 2100 },
  'Singapore|SG': { center: [103.8198, 1.3521], radiusMeters: 5800 },
  'Milan|IT': { center: [9.19, 45.4642], radiusMeters: 2700 },
  'Accra|GH': { center: [-0.187, 5.6037], radiusMeters: 2650 },
  'Tokyo|JP': { center: [139.6503, 35.6762], radiusMeters: 3600 },
  'London|GB': { center: [-0.1276, 51.5072], radiusMeters: 6800 },
  'Boston|US': { center: [-71.044296, 42.338517], radiusMeters: 1700 },
  'São Paulo|BR': { center: [-46.6333, -23.5505], radiusMeters: 3700 },
  'Berlin|DE': { center: [13.405, 52.52], radiusMeters: 5150 },
  'Copenhagen|DK': { center: [12.600197, 55.654517], radiusMeters: 850 },
};

function hash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i++) {
    result = Math.imul(result ^ value.charCodeAt(i), 16777619);
  }
  return result >>> 0;
}

// Two independent, stable fractions. This never changes a contact's stored place
// or coordinates, and produces the same point after refresh or in another browser.
export function sampleDisplayPosition(contact: MapContact): LngLat | null {
  if (contact.source !== 'sample' || !contact.place_id || !contact.city || !contact.country_code ||
      contact.latitude == null || contact.longitude == null) return null;
  const area = interiors[`${contact.city}|${contact.country_code.toUpperCase()}`];
  if (!area) return null;
  const base: LngLat = [Number(contact.longitude), Number(contact.latitude)];
  if (!base.every(Number.isFinite)) return null;
  // A same-named place elsewhere must not inherit this city's boundary.
  if (Math.abs(base[0] - area.center[0]) > 0.08 || Math.abs(base[1] - area.center[1]) > 0.08) return null;

  const angle = (hash(`${contact.id}|angle`) / 2 ** 32) * 2 * Math.PI;
  const distance = area.radiusMeters * (0.25 + 0.7 * Math.sqrt(hash(`${contact.id}|distance`) / 2 ** 32));
  const latitude = area.center[1] + (distance * Math.sin(angle)) / 111_200;
  const longitude = area.center[0] + (distance * Math.cos(angle)) / (111_200 * Math.cos(area.center[1] * Math.PI / 180));
  return [longitude, latitude];
}

export function displayPosition(contact: MapContact): LngLat {
  return sampleDisplayPosition(contact) ?? [Number(contact.longitude), Number(contact.latitude)];
}