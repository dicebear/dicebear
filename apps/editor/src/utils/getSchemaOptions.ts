import type { Style } from '@dicebear/core';
import { OptionsDescriptor } from '@dicebear/core';
import type { ConfigStyleOptions } from '@/types';

const defaultBackgroundColors = [
  // https://oklch-palette.vercel.app/#76,0.12,0,100
  'fff1f5',
  'ffdde6',
  'ffc8d8',
  'ffb3c9',
  'fc9ebb',

  // https://oklch-palette.vercel.app/#76,0.12,30,100
  'fff2ef',
  'ffdfd9',
  'ffcbc2',
  'ffb7ab',
  'ffa293',

  // https://oklch-palette.vercel.app/#76,0.12,60,100
  'fff3e9',
  'ffe1c9',
  'ffcfa8',
  'ffbc84',
  'f5ac6f',

  // https://oklch-palette.vercel.app/#76,0.12,90,100
  'fff5d9',
  'ffe5a0',
  'f7d67c',
  'e9c96e',
  'dbbb60',

  // https://oklch-palette.vercel.app/#76,0.12,120,100
  'edffb9',
  'ddf399',
  'cfe58c',
  'c2d77e',
  'b5ca71',

  // https://oklch-palette.vercel.app/#76,0.12,150,100
  'dfffe4',
  'aefebe',
  'a0efb1',
  'a0efb1',
  '85d496',

  // https://oklch-palette.vercel.app/#76,0.12,180,100
  'd8fff6',
  '91ffea',
  '77f3dc',
  '68e5cf',
  '59d7c1',

  // https://oklch-palette.vercel.app/#76,0.12,210,100
  'e2faff',
  'b6f4ff',
  '80ecff',
  '5fe0f6',
  '4fd3e8',

  // https://oklch-palette.vercel.app/#76,0.12,240,100
  'ecf7ff',
  'd1ebff',
  'b5e0ff',
  '97d4ff',
  '77c8ff',

  // https://oklch-palette.vercel.app/#76,0.12,270,100
  'f1f5ff',
  'dee7ff',
  'cbd9ff',
  'b8caff',
  'a5bcff',

  // https://oklch-palette.vercel.app/#76,0.12,300,100
  'f7f3ff',
  'ebe2ff',
  'e0d0ff',
  'd5bfff',
  'caadfe',

  // https://oklch-palette.vercel.app/#76,0.12,330,100
  'fff0fd',
  'ffdafa',
  'ffc2f9',
  'f7b0f0',
  'f7b0f0',
];

export default function getSchemaOptions(style: Style): ConfigStyleOptions {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: ConfigStyleOptions = {};

  for (const [key, field] of Object.entries(descriptor)) {
    // The editor's export produces static files, so the animation option is
    // hidden. Animated variants carry weight 0 in every style, which keeps
    // avatars static as long as nothing sets animationVariant.
    if (key === 'animationVariant') {
      continue;
    }

    // Only show variant (enum with weighted) and color options in the editor
    const isColor = field.type === 'color';
    const isVariant =
      field.type === 'enum' && 'weighted' in field && field.weighted === true;
    const isBackgroundColor = key === 'backgroundColor';

    if (!isColor && !isVariant && !isBackgroundColor) {
      continue;
    }

    const isArray = 'list' in field && field.list === true;
    const componentName = key.replace(/Variant$/, '');

    // A component is only optional when the style gives it a default
    // probability below 100. Components that are always rendered (the
    // implicit default of 100) must not offer an empty "none" option.
    const componentProbability =
      style.components().get(componentName)?.probability() ?? 100;
    const hasProbability = componentProbability < 100;

    const values = new Set<string>();

    if (hasProbability) {
      values.add('');
    }

    if (field.type === 'enum' && 'values' in field) {
      for (const value of field.values) {
        values.add(value);
      }
    }

    if (isColor) {
      // Use the style's defined color values (strip # prefix for the editor)
      const colorName = key.replace(/Color$/, '');
      const styleColor = style.colors().get(colorName);

      if (styleColor) {
        for (const value of styleColor.values()) {
          values.add(value.replace(/^#/, ''));
        }
      }
    }

    if (isBackgroundColor && values.size <= 1) {
      for (const fallbackBackgroundColor of defaultBackgroundColors) {
        values.add(fallbackBackgroundColor);
      }
    }

    result[key] = {
      values: Array.from(values.values()),
      isColor,
      isArray,
      hasProbability,
      probability: componentProbability,
    };
  }

  return result;
}
