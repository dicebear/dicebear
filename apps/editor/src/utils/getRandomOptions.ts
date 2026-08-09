import { Color } from '@dicebear/core';
import type {
  ConfigStyleOption,
  ConfigStyleOptions,
  SelectedStyleOptions,
} from '@/types';
import getRandomBoolean from '@/utils/getRandomBoolean';
import getRandomNumber from '@/utils/getRandomNumber';

export default function getRandomOptions(
  configStyleOptions: ConfigStyleOptions,
): SelectedStyleOptions {
  const picked: Record<string, string> = {};
  const resolving = new Set<string>();

  /**
   * Resolves one option, drawing the groups it depends on first. Results are
   * memoized so a shared reference (thumbs has both eyes and mouth contrast
   * against shape) sees the same color.
   */
  function resolve(key: string): string {
    if (key in picked) {
      return picked[key];
    }

    const styleOption = configStyleOptions[key];

    // A circular contrastTo/notEqualTo chain would recurse forever. Core
    // throws on those; here dropping the constraint is enough, since an
    // unresolvable reference just leaves the color unrestricted.
    if (!styleOption || resolving.has(key)) {
      return '';
    }

    resolving.add(key);
    picked[key] = styleOption.isColor
      ? resolveColor(styleOption)
      : resolveValue(styleOption);
    resolving.delete(key);

    return picked[key];
  }

  function resolveValue(styleOption: ConfigStyleOption): string {
    const values = styleOption.values;

    if (!getRandomBoolean(styleOption.probability)) {
      return values[0] ?? '';
    }

    const possibleValues = values.filter((v) => v && v !== 'transparent');

    if (possibleValues.length === 0) {
      return values[0] ?? '';
    }

    return possibleValues[getRandomNumber(0, possibleValues.length - 1)];
  }

  /**
   * Applies the style's own color constraints, because the editor writes a
   * single explicit color per group into the avatar options. A one-element
   * list leaves the renderer nothing to sort or filter, so whatever is picked
   * here is final.
   */
  function resolveColor(styleOption: ConfigStyleOption): string {
    let candidates = styleOption.values.filter((v) => v && v !== 'transparent');

    if (candidates.length === 0) {
      return styleOption.values[0] ?? '';
    }

    const contrastTo = styleOption.contrastTo;
    const refColor = contrastTo ? resolve(`${contrastTo}Color`) : '';

    if (refColor) {
      candidates = Color.sortByContrast(candidates, refColor);
    }

    const excluded = (styleOption.notEqualTo ?? [])
      .map((name) => resolve(`${name}Color`))
      .filter(Boolean);

    if (excluded.length > 0) {
      candidates = Color.filterNotEqualTo(candidates, excluded);
    }

    // Contrast sorting already ranks the candidates by how well they read
    // against the reference, so take the first instead of drawing at random.
    // That is the same choice the renderer makes for an unset color.
    if (refColor) {
      return candidates[0];
    }

    return candidates[getRandomNumber(0, candidates.length - 1)];
  }

  const result: SelectedStyleOptions = {};

  // Two passes keep the output in the order the style declares its options,
  // independent of the order the dependencies happen to resolve in.
  for (const key in configStyleOptions) {
    if (Object.prototype.hasOwnProperty.call(configStyleOptions, key)) {
      resolve(key);
    }
  }

  for (const key in configStyleOptions) {
    if (Object.prototype.hasOwnProperty.call(configStyleOptions, key)) {
      result[key] = picked[key];
    }
  }

  return result;
}
