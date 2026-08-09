import type { Style } from './Style.js';
import { COLOR_ORDER_FIXED, COLOR_ORDER_RANDOM } from './StyleOptions.js';

interface StringField {
  readonly type: 'string';
  readonly list?: true;
}

interface NumberField {
  readonly type: 'number';
  readonly min?: number;
  readonly max?: number;
  readonly list?: true;
}

interface BooleanField {
  readonly type: 'boolean';
}

interface EnumField {
  readonly type: 'enum';
  readonly values: readonly string[];
  readonly list?: true;
  readonly weighted?: true;
  // When set, `values` are suggestions, not the only allowed values. Tooling
  // should accept input outside the list (e.g. the `tags` filter, whose grammar
  // also takes `!`-disallows and bare categories).
  readonly open?: true;
}

interface ColorField {
  readonly type: 'color';
  readonly list?: true;
  readonly contrastTo?: string;
  readonly notEqualTo?: readonly string[];
}

interface RangeField {
  readonly type: 'range';
  readonly min?: number;
  readonly max?: number;
}

export type FieldDescriptor =
  | StringField
  | NumberField
  | BooleanField
  | EnumField
  | ColorField
  | RangeField;

export type Descriptor = Record<string, FieldDescriptor>;

/**
 * Builds a descriptor of every option a given style accepts. Tooling such as
 * the editor uses the result to render form controls and validation hints
 * without having to introspect the style itself.
 */
export class OptionsDescriptor {
  static #rotateRange: RangeField = { type: 'range', min: -360, max: 360 };
  static #translateRange: RangeField = { type: 'range', min: -1000, max: 1000 };

  #descriptor?: Descriptor;
  #style: Style;

  constructor(style: Style) {
    this.#style = style;
  }

  /**
   * Returns a deep clone of the descriptor, building it lazily on first call.
   */
  toJSON(): Descriptor {
    this.#descriptor ??= this.#build();

    return structuredClone(this.#descriptor);
  }

  /**
   * Walks the style's components and colors and assembles the field map.
   */
  #build(): Descriptor {
    const result: Descriptor = {
      seed: { type: 'string' },
      size: { type: 'number', min: 1, max: 4096 },
      idRandomization: { type: 'boolean' },
      title: { type: 'string' },
      flip: {
        type: 'enum',
        values: ['none', 'horizontal', 'vertical', 'both'],
        list: true,
      },
      fontFamily: { type: 'string', list: true },
      fontWeight: { type: 'number', min: 1, max: 1000, list: true },
      scale: { type: 'range', min: 0, max: 10 },
      borderRadius: { type: 'range', min: 0, max: 50 },
      rotate: OptionsDescriptor.#rotateRange,
      translateX: OptionsDescriptor.#translateRange,
      translateY: OptionsDescriptor.#translateRange,
    };

    const tags = new Set<string>();

    for (const [name, component] of this.#style.components()) {
      if (component.extendsName() !== undefined) {
        continue;
      }

      const variants = component.variants();

      result[`${name}Variant`] = {
        type: 'enum',
        values: Array.from(variants.keys()).sort(),
        list: true,
        weighted: true,
      };
      result[`${name}Probability`] = { type: 'number', min: 0, max: 100 };

      for (const variant of variants.values()) {
        for (const tag of variant.tags()) {
          tags.add(tag);
        }
      }
    }

    for (const name of [...this.#style.colors().keys(), 'background']) {
      const color = this.#style.colors().get(name);
      const contrastTo = color?.contrastTo();
      const notEqualTo = color?.notEqualTo() ?? [];

      result[`${name}Color`] = {
        type: 'color',
        list: true,
        ...(contrastTo ? { contrastTo } : {}),
        ...(notEqualTo.length > 0
          ? { notEqualTo: Array.from(notEqualTo) }
          : {}),
      };
      result[`${name}ColorFill`] = {
        type: 'enum',
        values: ['solid', 'linear', 'radial'],
        list: true,
      };
      result[`${name}ColorFillStops`] = { type: 'range', min: 2 };
      result[`${name}ColorAngle`] = OptionsDescriptor.#rotateRange;
      result[`${name}ColorOrder`] = {
        type: 'enum',
        values: [COLOR_ORDER_RANDOM, COLOR_ORDER_FIXED],
      };
    }

    // Only advertise the `tags` filter when the style actually carries tags.
    // The values are the sorted union of every tag across the style's variants,
    // but `open` marks them as suggestions: the filter also accepts `!`
    // disallows and bare categories. Only an unknown category is ignored. An
    // unknown value inside a category the style does use matches nothing, so
    // every variant tagged on that axis is dropped.
    if (tags.size > 0) {
      result.tags = {
        type: 'enum',
        values: Array.from(tags).sort(),
        list: true,
        open: true,
      };
    }

    return result;
  }
}
