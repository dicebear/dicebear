/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u/%40dicebear%2Fbottts?node-id=4%3A3179
 */

export interface Options {
  mouth?: (
    | 'bite'
    | 'diagram'
    | 'grill01'
    | 'grill02'
    | 'grill03'
    | 'smile01'
    | 'smile02'
    | 'square01'
    | 'square02'
  )[];
  eyes?: (
    | 'bulging'
    | 'dizzy'
    | 'eva'
    | 'frame1'
    | 'frame2'
    | 'glow'
    | 'happy'
    | 'hearts'
    | 'robocop'
    | 'round'
    | 'roundFrame01'
    | 'roundFrame02'
    | 'sensor'
    | 'shade01'
  )[];
  backgroundColor?: string[];
}

export type ColorPickCollection = Record<string, string>;

export type ComponentGroup = Record<string, ComponentGroupItem>;
export type ComponentGroupCollection = Record<string, ComponentGroup>;
export type ComponentGroupItem = (
  components: ComponentPickCollection,
  colors: ColorPickCollection
) => string;
export type ComponentPickCollection = Record<string, ComponentPick>;
export type ComponentPick =
  | {
      name: string;
      value: ComponentGroupItem;
    }
  | undefined;
