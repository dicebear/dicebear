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
  | string
  | StyleDefinitionColorReference;
export type StyleDefinitionElementValue =
  | string
  | StyleDefinitionVariableReference;
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

export interface StyleDefinitionElement {
  readonly type: StyleDefinitionElementType;
  readonly name?: string;
  readonly value?: StyleDefinitionElementValue;
  readonly attributes?: StyleDefinitionAttributes;
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
  | StyleDefinitionComponentBase
  | StyleDefinitionComponentAlias;

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
