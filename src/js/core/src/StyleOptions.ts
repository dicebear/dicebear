export type StyleOptionsFlipValue = 'none' | 'horizontal' | 'vertical' | 'both';
export type StyleOptionsColorFillValue = 'solid' | 'linear' | 'radial';
export type StyleOptionsColorOrderValue = 'random' | 'fixed';

export const COLOR_ORDER_RANDOM: StyleOptionsColorOrderValue = 'random';
export const COLOR_ORDER_FIXED: StyleOptionsColorOrderValue = 'fixed';

/**
 * A parsed `tags` filter token. {@link Options.tags} decodes each raw
 * `category` / `category:value` / `!…` string into this shape so the resolver
 * composes the filter without parsing the grammar itself.
 */
export interface TagFilterToken {
  readonly category: string;
  readonly value?: string;
  readonly negated: boolean;
}

// ---------------------------------------------------------------------------
// StyleOptions
//
// Uses mapped types and template literal types to derive a precise options
// interface from a style definition. When D has literal keys (e.g. from a
// JSON import) the result provides full autocomplete. When D is the generic
// StyleDefinition it falls back to an index signature.
//
// The helper types use conditional `extends` checks instead of indexed access
// so that D does not need to extend StyleDefinition. This is necessary because
// JSON imports widen string values to `string`, which doesn't satisfy the
// literal unions in StyleDefinition (e.g. StyleDefinitionElementType).
// ---------------------------------------------------------------------------

// Extracts literal component/color names from D; `never` when generic.
type ComponentNames<D> = D extends {
  components: Record<infer K extends string, unknown>;
}
  ? string extends K
    ? never
    : K
  : never;

type ColorNames<D> = D extends {
  colors: Record<infer K extends string, unknown>;
}
  ? string extends K
    ? never
    : K
  : never;

// Always includes 'background' because the renderer unconditionally
// calls options.color('background') when rendering.
type AllColorNames<D> = ColorNames<D> | 'background';

// Resolves variant names for component C, transparently following an
// `extends` alias to the source component. Falls back to `string` when
// the definition or the component is generic.
type ResolveComponent<D, C extends string> = D extends {
  components: Record<string, unknown>;
}
  ? C extends keyof D['components']
    ? D['components'][C] extends { extends: infer P extends string }
      ? P extends keyof D['components']
        ? D['components'][P]
        : never
      : D['components'][C]
    : never
  : never;

type VariantNames<D, C extends string> =
  ResolveComponent<D, C> extends {
    variants: Record<infer V extends string, unknown>;
  }
    ? string extends V
      ? string
      : V
    : string;

type HasSpecificKeys<D> = [ComponentNames<D>] extends [never]
  ? [ColorNames<D>] extends [never]
    ? false
    : true
  : true;

export interface StyleOptionsBase {
  readonly seed?: string;
  readonly size?: number;
  readonly idRandomization?: boolean;
  readonly title?: string;
  readonly flip?: StyleOptionsFlipValue | readonly StyleOptionsFlipValue[];
  readonly fontFamily?: string | readonly string[];
  readonly fontWeight?: number | readonly number[];
  readonly scale?: number | readonly [number, number];
  readonly borderRadius?: number | readonly [number, number];
  readonly rotate?: number | readonly [number, number];
  readonly translateX?: number | readonly [number, number];
  readonly translateY?: number | readonly [number, number];
  readonly tags?: string | readonly string[];
}

// Variant option accepts a single name, an array, or a name-to-weight record
// for weighted PRNG selection.
type ComponentVariantOption<D, K extends string> =
  | VariantNames<D, K>
  | readonly VariantNames<D, K>[]
  | Readonly<Partial<Record<VariantNames<D, K>, number>>>;

// True when component C is declared as an alias (`{ extends: ... }`).
// Aliases have no own user options — their values come from the source component.
type IsAlias<D, C extends string> = D extends {
  components: Record<string, unknown>;
}
  ? C extends keyof D['components']
    ? D['components'][C] extends { extends: string }
      ? true
      : false
    : false
  : false;

// For each non-alias component C generates: Variant, Probability.
// Aliases are filtered out — they expose no own keys.
type ComponentOptions<D, C extends string> = [C] extends [never]
  ? unknown
  : {
      readonly [
        K in C as IsAlias<D, K> extends true ? never : `${K}Variant`
      ]?: ComponentVariantOption<D, K>;
    } & {
      readonly [
        K in C as IsAlias<D, K> extends true ? never : `${K}Probability`
      ]?: number;
    };

// For each color C generates: Color, ColorFill, ColorFillStops, ColorAngle,
// ColorOrder.
type ColorOptions<C extends string> = [C] extends [never]
  ? unknown
  : { readonly [K in C as `${K}Color`]?: string | readonly string[] } & {
      readonly [K in C as `${K}ColorFill`]?:
        StyleOptionsColorFillValue | readonly StyleOptionsColorFillValue[];
    } & {
      readonly [K in C as `${K}ColorFillStops`]?:
        number | readonly [number, number];
    } & {
      readonly [K in C as `${K}ColorAngle`]?:
        number | readonly [number, number];
    } & {
      readonly [K in C as `${K}ColorOrder`]?: StyleOptionsColorOrderValue;
    };

export type StyleOptions<D = unknown> = StyleOptionsBase &
  ComponentOptions<D, ComponentNames<D>> &
  ColorOptions<AllColorNames<D>> &
  (HasSpecificKeys<D> extends true
    ? unknown
    : { readonly [key: string]: unknown });
