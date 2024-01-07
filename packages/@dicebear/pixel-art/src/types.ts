/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
 */

export interface Options {
  accessories?: ('variant04' | 'variant03' | 'variant02' | 'variant01')[];
  accessoriesProbability?: number;
  clothing?: (
    | 'variant23'
    | 'variant22'
    | 'variant21'
    | 'variant20'
    | 'variant19'
    | 'variant18'
    | 'variant17'
    | 'variant16'
    | 'variant15'
    | 'variant14'
    | 'variant13'
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
  beard?: (
    | 'variant08'
    | 'variant07'
    | 'variant06'
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  beardProbability?: number;
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
  hair?: (
    | 'short24'
    | 'short23'
    | 'short22'
    | 'short21'
    | 'short20'
    | 'short19'
    | 'short18'
    | 'short17'
    | 'short16'
    | 'short15'
    | 'short14'
    | 'short13'
    | 'short12'
    | 'short11'
    | 'short10'
    | 'short09'
    | 'short08'
    | 'short07'
    | 'short06'
    | 'short05'
    | 'short04'
    | 'short03'
    | 'short02'
    | 'short01'
    | 'long21'
    | 'long20'
    | 'long19'
    | 'long18'
    | 'long17'
    | 'long16'
    | 'long15'
    | 'long14'
    | 'long13'
    | 'long12'
    | 'long11'
    | 'long10'
    | 'long09'
    | 'long08'
    | 'long07'
    | 'long06'
    | 'long05'
    | 'long04'
    | 'long03'
    | 'long02'
    | 'long01'
  )[];
  hat?: (
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
  hatProbability?: number;
  accessoriesColor?: string[];
  clothingColor?: string[];
  eyesColor?: string[];
  glassesColor?: string[];
  hairColor?: string[];
  hatColor?: string[];
  mouthColor?: string[];
  skinColor?: string[];
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
