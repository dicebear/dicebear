/**
 * Returns a curated description for a style option, or undefined if none exists.
 * Used by StyleOptionsCard to render help text under each option.
 */
export function getOptionDescription(name: string): string | undefined {
  if (name === 'seed') return 'The seed determines the initial value for the PRNG. With the same seed, the same avatar is generated every time.';
  if (name === 'size') return 'Output size in pixels. If omitted, the avatar scales to 100% of its container.';
  if (name === 'idRandomization') return 'Randomizes all SVG element IDs to avoid conflicts when embedding multiple avatars in the same page.';
  if (name === 'title') return 'Accessible title for the SVG element. Useful for screen readers.';
  if (name.match(/Probability$/)) return 'Probability that this component appears in the avatar.';
  if (name.match(/Variant$/)) return 'The visual variant for this component. If multiple values are given, the PRNG picks one.';
  if (name.match(/Color$/) && !name.match(/ColorFill/)) return 'Hex color value(s). If multiple values are given, the PRNG picks one.';
  if (name.match(/ColorFill$/)) return 'Fill mode for the color gradient. Only visible when multiple color stops are used.';
  if (name.match(/ColorFillStops$/)) return 'Number of color stops for gradient fills.';
  if (name.match(/ColorAngle$/)) return 'Rotation angle for gradient fills in degrees.';
  if (name === 'flip') return 'Mirror direction for the avatar.';
  if (name === 'scale') return 'Scale factor. A value of 1 corresponds to the original size. As a range [min, max], the PRNG picks a value in between.';
  if (name === 'borderRadius') return 'Corner radius as a percentage. 0 = sharp corners, 50 = full circle.';
  if (name === 'rotate' || name.match(/Rotate$/)) return 'Rotation in degrees. As a range [min, max], the PRNG picks a value in between.';
  if (name === 'translateX' || name === 'translateY' || name.match(/TranslateX$/) || name.match(/TranslateY$/)) return 'Translation as a percentage of the canvas size. As a range [min, max], the PRNG picks a value in between.';
  if (name === 'fontFamily') return 'Font family for text elements within the avatar SVG.';
  if (name === 'fontWeight') return 'Font weight for text elements within the avatar SVG.';

  return undefined;
}

/**
 * Returns curated example values for a style option, or undefined if none.
 * `colorExamples` is a callback that returns colors for a given color name
 * (so we don't pull `padColors`/`styleColors` into this util).
 */
export function getOptionExamples(
  name: string,
  colorExamples: (colorName: string, min?: number) => string[],
): (string | number | boolean)[] | undefined {
  if (name === 'backgroundColor') return colorExamples('background', 5);
  if (name.match(/Color$/)) {
    const colorName = name.slice(0, -'Color'.length);
    return colorExamples(colorName);
  }
  if (name.match(/ColorFill$/)) return ['solid', 'linear', 'radial'];
  if (name.match(/ColorFillStops$/)) return [2, 3, 4, 5];
  if (name.match(/ColorAngle$/)) return [0, 90, 180, 270];
  if (name === 'seed') return ['Felix', 'Aneka', 'Mia', 'James'];
  if (name === 'flip') return ['none', 'horizontal', 'vertical', 'both'];
  if (name === 'rotate') return [0, 90, 180, 270];
  if (name === 'scale') return [0.5, 0.75, 1, 1.5];
  if (name === 'borderRadius') return [0, 10, 25, 50];
  if (name === 'size') return [32, 64, 96, 128];
  if (name === 'translateX') return [-50, -25, 0, 25, 50];
  if (name === 'translateY') return [-50, -25, 0, 25, 50];
  if (name === 'fontWeight') return [100, 400, 700, 900];

  return undefined;
}
