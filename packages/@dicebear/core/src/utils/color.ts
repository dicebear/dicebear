import { Prng } from '../types.js';

export function convertColor(color: string): string {
  return 'transparent' === color ? color : `#${color}`;
}

export function getBackgroundColors(
  prng: Prng,
  backgroundColor: string[],
  backgroundType: 'solid' | 'gradientLinear'
): { primary: string; secondary: string } {
  let shuffledBackgroundColors = prng.shuffle(backgroundColor);

  if (shuffledBackgroundColors.length <= 1) {
    // If no background colour or only one background colour has been selected,
    // the random sorting logic can be omitted.
    shuffledBackgroundColors = backgroundColor;

    // A function call should in any case make an identical number of calls to the PRNG.
    prng.next();
  } else if (backgroundColor.length == 2 && backgroundType == 'gradientLinear') {
    // If the background is to be a colour gradient and exactly two background
    // colours have been specified, do not sort them randomly. In this case, we
    // assume that the order of the background colours was chosen on purpose.
    shuffledBackgroundColors = backgroundColor;

    // A function call should in any case make an identical number of calls to the PRNG.
    prng.next();
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
