/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv/%40dicebear%2Fthumbs
 */

export interface Options {
  shape?: (
    | 'default'
  )[];
  shapeRotation?: number[];
  shapeOffsetX?: number[];
  shapeOffsetY?: number[];
  face?: (
    | 'variant1'
    | 'variant2'
    | 'variant3'
    | 'variant5'
    | 'variant4'
  )[];
  faceRotation?: number[];
  faceOffsetX?: number[];
  faceOffsetY?: number[];
  eyes?: (
    | 'variant1W10'
    | 'variant1W12'
    | 'variant1W14'
    | 'variant1W16'
    | 'variant2W10'
    | 'variant2W12'
    | 'variant2W14'
    | 'variant2W16'
    | 'variant3W10'
    | 'variant3W12'
    | 'variant3W14'
    | 'variant3W16'
    | 'variant4W10'
    | 'variant4W12'
    | 'variant4W14'
    | 'variant4W16'
    | 'variant5W10'
    | 'variant5W12'
    | 'variant5W14'
    | 'variant5W16'
    | 'variant6W10'
    | 'variant6W12'
    | 'variant6W14'
    | 'variant6W16'
    | 'variant7W10'
    | 'variant7W12'
    | 'variant7W14'
    | 'variant7W16'
    | 'variant8W10'
    | 'variant8W12'
    | 'variant8W14'
    | 'variant8W16'
    | 'variant9W10'
    | 'variant9W12'
    | 'variant9W14'
    | 'variant9W16'
  )[];
  mouth?: (
    | 'variant2'
    | 'variant1'
    | 'variant3'
    | 'variant4'
    | 'variant5'
  )[];
  backgroundColor?: string[];
  shapeColor?: string[];
  mouthColor?: string[];
  eyesColor?: string[];
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
      rotation: number | undefined,
      offsetX: number | undefined,
      offsetY: number | undefined,
    }
  | undefined;
