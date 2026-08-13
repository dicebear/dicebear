import { capitalCase } from 'change-case';
import { getStyleCardSeeds } from '../config/previewRowSeeds';

/** "big-ears-neutral" -> "Big Ears Neutral" */
export function styleDisplayName(name: string): string {
  return capitalCase(name);
}

export function stylePageUrl(name: string): string {
  return `/styles/${name}/`;
}

/**
 * Preview seed for a style, the first one of its index card, so the face
 * matches the one on the styles overview. Only catalog styles reach this
 * (useStyleRankings filters the stats to them), so the accessor's loud
 * failure for an unknown name is the right behavior here too.
 */
export function styleSeed(name: string): string {
  return getStyleCardSeeds(name)[0];
}
