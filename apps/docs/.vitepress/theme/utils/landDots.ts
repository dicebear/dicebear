/**
 * Turns the Natural Earth land polygons into a regular grid of dots, which is
 * what the stats map draws instead of country outlines.
 *
 * The projection is plain equirectangular: longitude and latitude map straight
 * onto x and y. Fancier projections need lookup tables, and the dot grid hides
 * most of the distortion anyway.
 */

// Latitude window of the map. The bottom cuts off Antarctica, the top is high
// enough to keep Greenland whole.
export const LAT_MIN = -57;
export const LAT_MAX = 83;
export const LNG_MIN = -180;
export const LNG_MAX = 180;

export const LAT_SPAN = LAT_MAX - LAT_MIN;
export const LNG_SPAN = LNG_MAX - LNG_MIN;

/** Spacing of the dot grid, in degrees. */
export const DOT_STEP = 2.5;

/** Dots across the full width, which sets how fine the grid renders. */
export const DOT_COLUMNS = Math.round(LNG_SPAN / DOT_STEP);

/** Width divided by height once the grid is drawn with round dots. */
export const MAP_ASPECT = LNG_SPAN / LAT_SPAN;

export function pointInPolygon(
  x: number,
  y: number,
  ring: number[][],
): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

interface OuterRing {
  ring: number[][];
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

function collectOuterRings(geoJson: any): OuterRing[] {
  const rings: OuterRing[] = [];

  for (const feature of geoJson.features ?? []) {
    const polygons =
      feature.geometry?.type === 'MultiPolygon'
        ? feature.geometry.coordinates
        : [feature.geometry?.coordinates];

    for (const poly of polygons) {
      // Index 0 is the outer ring, the rest are holes. Lakes are small enough
      // at this dot spacing that skipping the holes costs a dot or two.
      const ring = poly?.[0];

      if (!ring || ring.length < 3) continue;

      let minLng = Infinity,
        maxLng = -Infinity,
        minLat = Infinity,
        maxLat = -Infinity;

      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }

      rings.push({ ring, minLng, maxLng, minLat, maxLat });
    }
  }

  return rings;
}

/**
 * Every grid position that falls on land, as `[lat, lng]`. The map draws these
 * as dots, and the avatar markers pick their positions from the same list, so
 * a marker can never end up in the ocean.
 */
export function buildLandDots(geoJson: any): [number, number][] {
  const dots: [number, number][] = [];

  if (!geoJson) return dots;

  const rings = collectOuterRings(geoJson);

  for (let lat = LAT_MAX; lat >= LAT_MIN; lat -= DOT_STEP) {
    for (let lng = LNG_MIN; lng <= LNG_MAX; lng += DOT_STEP) {
      // The bounding box check is what keeps this cheap: without it every one
      // of the ~8000 grid positions would run a full point-in-polygon test
      // against every ring.
      for (const r of rings) {
        if (lng < r.minLng || lng > r.maxLng) continue;
        if (lat < r.minLat || lat > r.maxLat) continue;

        if (pointInPolygon(lng, lat, r.ring)) {
          dots.push([lat, lng]);
          break;
        }
      }
    }
  }

  return dots;
}

/** Horizontal position of a longitude, as a fraction of the map width. */
export function projectX(lng: number): number {
  return (lng - LNG_MIN) / LNG_SPAN;
}

/** Vertical position of a latitude, as a fraction of the map height. */
export function projectY(lat: number): number {
  return (LAT_MAX - lat) / LAT_SPAN;
}
