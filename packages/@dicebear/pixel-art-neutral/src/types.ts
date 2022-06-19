/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9/%40dicebear%2Fpixel-art?node-id=5%3A1419
 */

export interface Options {
  eyes?: (
    | 'variant12'
    | 'variant11'
    | 'variant10'
    | 'variant09'
    | 'variant08'
    | 'variant07'
    | 'variant06'
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  glasses?: (
    | 'light07'
    | 'light06'
    | 'light05'
    | 'light04'
    | 'light03'
    | 'light02'
    | 'light01'
    | 'dark07'
    | 'dark06'
    | 'dark05'
    | 'dark04'
    | 'dark03'
    | 'dark02'
    | 'dark01'
  )[];
  glassesProbability?: number;
  mouth?: (
    | 'sad10'
    | 'sad09'
    | 'sad08'
    | 'sad07'
    | 'sad06'
    | 'sad05'
    | 'sad04'
    | 'sad03'
    | 'sad02'
    | 'sad01'
    | 'happy13'
    | 'happy12'
    | 'happy11'
    | 'happy10'
    | 'happy09'
    | 'happy08'
    | 'happy07'
    | 'happy06'
    | 'happy05'
    | 'happy04'
    | 'happy03'
    | 'happy02'
    | 'happy01'
  )[];
  eyesColor?: string[];
  glassesColor?: string[];
  mouthColor?: string[];
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
