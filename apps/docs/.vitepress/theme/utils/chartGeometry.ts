/**
 * Coordinate scaling shared by the stats charts (AppStatsSparkline,
 * AppStatsBannerCard, StylePopularity).
 *
 * The y scale runs from zero to the series' own peak. A min-to-max scale
 * would blow every wiggle up to the full height and make a noisy small
 * series look as dramatic as a real climb; anchored at zero, the amplitude
 * reflects the change relative to the series' own level, so the shapes of
 * different charts can be compared.
 */

export interface SeriesPoint {
  x: number;
  y: number;
}

export interface SeriesCoordsOptions {
  width: number;
  height: number;
  padX?: number;
  padTop?: number;
  padBottom?: number;
}

/** Returns [] for series too short to draw a line. */
export function seriesCoords(
  values: number[],
  { width, height, padX = 0, padTop = 0, padBottom = 0 }: SeriesCoordsOptions,
): SeriesPoint[] {
  if (values.length < 2) {
    return [];
  }

  const max = Math.max(...values) || 1;
  const stepX = (width - padX * 2) / (values.length - 1);
  const innerHeight = height - padTop - padBottom;

  return values.map((value, index) => ({
    x: padX + index * stepX,
    y: height - padBottom - (value / max) * innerHeight,
  }));
}

export function seriesLinePath(coords: SeriesPoint[]): string {
  return coords
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');
}

/** The line path closed along the bottom edge, for a gradient area fill. */
export function seriesAreaPath(coords: SeriesPoint[], height: number): string {
  if (coords.length === 0) {
    return '';
  }

  const first = coords[0];
  const last = coords[coords.length - 1];

  return `${seriesLinePath(coords)} L${last.x.toFixed(1)},${height} L${first.x.toFixed(1)},${height} Z`;
}
