export const MAX_SIZE = 2048;
export const DEFAULT_SIZE = 512;

/**
 * Clamps a requested size into a sane integer range, falling back to
 * `DEFAULT_SIZE` for non-finite or non-positive inputs.
 */
export function sanitizeSize(size: number): number {
  if (!Number.isFinite(size) || size <= 0) {
    return DEFAULT_SIZE;
  }

  return Math.floor(Math.min(size, MAX_SIZE));
}
