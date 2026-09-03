import { exampleSeeds } from '@theme/config/styleCategories';

/**
 * Build preview options for general (non-component) avatar properties —
 * seed, backgroundType, backgroundRotation, and generic values.
 * Component-specific options (Variant, Color, Probability) are rendered
 * through ComponentPreview.
 */
export function getAvatarPropertyPreviewOptions(
  propertyName: string,
  propertyValue: unknown,
): Record<string, unknown> {
  if (propertyName === 'seed') {
    return {
      [propertyName]: propertyValue,
    };
  }

  if (propertyName === 'backgroundType') {
    return {
      backgroundColor: ['0ea5e9', 'ec4899'],
      [propertyName]: [propertyValue],
    };
  }

  if (propertyName === 'backgroundRotation') {
    return {
      backgroundColor: ['3f3f46', 'd4d4d8'],
      backgroundType: ['gradientLinear'],
      [propertyName]: [propertyValue],
    };
  }

  // A speed or delay only shows once something plays: the global ones switch
  // every animation on, the per-name ones only their own animation.
  const named = propertyName.match(/^(.+)Animation(Speed|Delay)$/);

  if (named) {
    return {
      seed: exampleSeeds[0],
      [`${named[1]}Animation`]: true,
      [propertyName]: propertyValue,
    };
  }

  if (propertyName === 'animationSpeed' || propertyName === 'animationDelay') {
    return {
      seed: exampleSeeds[0],
      animation: true,
      [propertyName]: propertyValue,
    };
  }

  // Every tile in the row shows the same avatar so the option being previewed is
  // the only thing that changes between them.
  return {
    seed: exampleSeeds[0],
    [propertyName]:
      typeof propertyValue === 'string' ? [propertyValue] : propertyValue,
  };
}
