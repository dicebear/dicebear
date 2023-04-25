import { Prng } from '../types.js';

export function convertColor(color: string): string {
  return 'transparent' === color ? color : `#${color}`;
}

export function getBackgroundColors(
  prng: Prng,
  backgroundColor: string[]
): { primary: string; secondary: string } {
  let shuffledBackgroundColors: string[];

  if (backgroundColor.length <= 2) {
    // A function call should in any case make an identical number of calls to the PRNG.
    prng.next();

    shuffledBackgroundColors = backgroundColor;
  } else {
    shuffledBackgroundColors = prng.shuffle(backgroundColor);
  }

  if (shuffledBackgroundColors.length === 0) {
    shuffledBackgroundColors = ['transparent'];
  }

  const primary = shuffledBackgroundColors[0];
  const secondary = shuffledBackgroundColors[1] ?? shuffledBackgroundColors[0];

  return {
    primary: convertColor(primary),
    secondary: convertColor(secondary),
  };
}
