export function pointInPolygon(x: number, y: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function buildLandPoints(geoJson: any): [number, number][] {
  const points: [number, number][] = [];
  if (!geoJson) return points;

  for (const feature of geoJson.features) {
    const polygons = feature.geometry.type === 'MultiPolygon'
      ? feature.geometry.coordinates
      : [feature.geometry.coordinates];
    for (const poly of polygons) {
      const ring = poly[0]; // outer ring
      if (!ring || ring.length < 3) continue;
      // Compute bounding box
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
      // Sample points within the bounding box
      const area = (maxLng - minLng) * (maxLat - minLat);
      const samples = Math.max(2, Math.floor(area / 50));
      for (let i = 0; i < samples; i++) {
        const lng = minLng + Math.random() * (maxLng - minLng);
        const lat = minLat + Math.random() * (maxLat - minLat);
        if (pointInPolygon(lng, lat, ring)) {
          points.push([lat, lng]);
        }
      }
    }
  }

  return points;
}

export interface PreloadBuffer {
  getPreloadedUrl(): string;
}

export function createPreloadBuffer(generateUrl: () => string, size = 6): PreloadBuffer {
  const preloadedUrls: string[] = [];

  function preload(url: string) {
    const img = new Image();
    img.src = url;
  }

  while (preloadedUrls.length < size) {
    const url = generateUrl();
    preloadedUrls.push(url);
    preload(url);
  }

  return {
    getPreloadedUrl(): string {
      if (preloadedUrls.length > 0) {
        const url = preloadedUrls.shift()!;
        const newUrl = generateUrl();
        preloadedUrls.push(newUrl);
        preload(newUrl);
        return url;
      }
      return generateUrl();
    },
  };
}
