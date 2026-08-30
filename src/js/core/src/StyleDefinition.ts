export interface StyleDefinitionMetaLicense {
  readonly name?: string;
  readonly url?: string;
  readonly text?: string;
}

export interface StyleDefinitionMetaCreator {
  readonly name?: string;
  readonly url?: string;
}

export interface StyleDefinitionMetaSource {
  readonly name?: string;
  readonly url?: string;
}

export interface StyleDefinitionMeta {
  readonly license?: StyleDefinitionMetaLicense;
  readonly creator?: StyleDefinitionMetaCreator;
  readonly source?: StyleDefinitionMetaSource;
}

export interface StyleDefinitionVariableReference {
  readonly type: 'variable';
  readonly name: 'initial' | 'initials' | 'fontWeight' | 'fontFamily';
}

export interface StyleDefinitionColorReference {
  readonly type: 'color';
  readonly name: string;
}

export type StyleDefinitionColorAttributeValue =
  string | StyleDefinitionColorReference;
export type StyleDefinitionElementValue =
  string | StyleDefinitionVariableReference;
export type StyleDefinitionElementType = 'element' | 'text' | 'component';

export interface StyleDefinitionAttributes {
  readonly color?: StyleDefinitionColorAttributeValue;
  readonly 'flood-color'?: StyleDefinitionColorAttributeValue;
  readonly 'lighting-color'?: StyleDefinitionColorAttributeValue;
  readonly 'stop-color'?: StyleDefinitionColorAttributeValue;
  readonly fill?: StyleDefinitionColorAttributeValue;
  readonly stroke?: StyleDefinitionColorAttributeValue;
  readonly 'font-family'?: string | StyleDefinitionVariableReference;
  readonly 'font-weight'?: string | StyleDefinitionVariableReference;
  readonly [key: string]:
    | string
    | StyleDefinitionColorReference
    | StyleDefinitionVariableReference
    | undefined;
}

export type StyleDefinitionEasingKeyword =
  'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'hold';

/**
 * A cubic bezier easing given by its two control points. `x1`/`x2` stay
 * within 0..1, while `y1`/`y2` may leave that range for overshoot curves.
 */
export interface StyleDefinitionEasingBezier {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export type StyleDefinitionEasing =
  StyleDefinitionEasingKeyword | StyleDefinitionEasingBezier;

/**
 * A keyframe on an animation timeline. `at` is a percentage of the
 * animation's duration. `easing` shapes the segment from this keyframe to
 * the next one and falls back to the animation's default easing.
 */
export interface StyleDefinitionAnimationKeyframe {
  readonly at: number;
  readonly value: number;
  readonly easing?: StyleDefinitionEasing;
}

export interface StyleDefinitionAnimationTrack {
  readonly keyframes: readonly StyleDefinitionAnimationKeyframe[];
}

export type StyleDefinitionAnimationTrackName =
  'translateX' | 'translateY' | 'rotate' | 'scaleX' | 'scaleY' | 'opacity';

export type StyleDefinitionAnimationDirection =
  'normal' | 'reverse' | 'alternate' | 'alternateReverse';

/**
 * The transform origin for `rotate` and `scale` tracks, as a percentage of
 * the element's bounding box.
 */
export interface StyleDefinitionAnimationOrigin {
  readonly x: number;
  readonly y: number;
}

/**
 * One animation timeline for an element. Rendered to CSS only when the
 * `animation` render option is enabled. Absent fields carry these defaults:
 * `delay` 0, `iterations` `'infinite'`, `direction` `'normal'`, `fill`
 * `'none'`, `easing` `'linear'`, `origin` center (50/50). The optional
 * `name` groups the timeline under a user-selectable animation: the
 * `animation` option accepts these names to play a subset, and a timeline
 * without a name only plays when the option enables all animations.
 */
export interface StyleDefinitionAnimation {
  readonly name?: string;
  readonly duration: number;
  readonly delay?: number;
  readonly iterations?: 'infinite' | number;
  readonly direction?: StyleDefinitionAnimationDirection;
  readonly fill?: 'none' | 'forwards';
  readonly easing?: StyleDefinitionEasing;
  readonly origin?: StyleDefinitionAnimationOrigin;
  readonly tracks: Readonly<
    Partial<
      Record<StyleDefinitionAnimationTrackName, StyleDefinitionAnimationTrack>
    >
  >;
}

export interface StyleDefinitionElement {
  readonly type: StyleDefinitionElementType;
  readonly name?: string;
  readonly value?: StyleDefinitionElementValue;
  readonly attributes?: StyleDefinitionAttributes;
  readonly animations?: readonly StyleDefinitionAnimation[];
  readonly children?: readonly StyleDefinitionElement[];
}

export interface StyleDefinitionCanvas {
  readonly width: number;
  readonly height: number;
  readonly elements: readonly StyleDefinitionElement[];
}

export interface StyleDefinitionColor {
  readonly values: readonly string[];
  readonly notEqualTo?: readonly string[];
  readonly contrastTo?: string;
}

/**
 * A closed numeric range. `min === max` represents a fixed value. `step`
 * (consumed by {@link Prng.float}; ignored by {@link Prng.integer}) quantizes
 * the range to multiples of `step` starting at `min`; non-positive or absent
 * step means continuous.
 */
export interface Range {
  readonly min: number;
  readonly max: number;
  readonly step?: number;
}

export interface StyleDefinitionComponentTranslate {
  readonly x?: Range;
  readonly y?: Range;
}

export interface StyleDefinitionComponentVariant {
  readonly elements: readonly StyleDefinitionElement[];
  readonly weight?: number;
  readonly tags?: readonly string[];
}

export interface StyleDefinitionComponentBase {
  readonly width: number;
  readonly height: number;
  readonly probability?: number;
  readonly rotate?: Range;
  readonly scale?: Range;
  readonly translate?: StyleDefinitionComponentTranslate;
  readonly variants: Readonly<Record<string, StyleDefinitionComponentVariant>>;
}

export interface StyleDefinitionComponentAlias {
  readonly extends: string;
}

export type StyleDefinitionComponent =
  StyleDefinitionComponentBase | StyleDefinitionComponentAlias;

export interface StyleDefinition {
  readonly $id?: string;
  readonly $schema?: string;
  readonly $comment?: string;
  readonly meta?: StyleDefinitionMeta;
  readonly attributes?: StyleDefinitionAttributes;
  readonly canvas: StyleDefinitionCanvas;
  readonly components?: Readonly<Record<string, StyleDefinitionComponent>>;
  readonly colors?: Readonly<Record<string, StyleDefinitionColor>>;
}
