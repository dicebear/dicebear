/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/FCwwMBxsRND9Mbtpg5PUic
 */

export interface Options {
  hair?: (
    | 'variant48'
    | 'variant47'
    | 'variant46'
    | 'variant45'
    | 'variant44'
    | 'variant43'
    | 'variant42'
    | 'variant41'
    | 'variant40'
    | 'variant39'
    | 'variant38'
    | 'variant37'
    | 'variant36'
    | 'variant35'
    | 'variant34'
    | 'variant33'
    | 'variant32'
    | 'variant31'
    | 'variant30'
    | 'variant29'
    | 'variant28'
    | 'variant27'
    | 'variant26'
    | 'variant25'
    | 'variant24'
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
  hairAccessories?: (
    | 'flowers'
  )[];
  hairAccessoriesProbability?: number;
  head?: (
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  eyes?: (
    | 'variant24'
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
  eyebrows?: (
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
  earrings?: (
    | 'variant01'
    | 'variant02'
    | 'variant03'
  )[];
  earringsProbability?: number;
  freckles?: (
    | 'variant01'
  )[];
  frecklesProbability?: number;
  nose?: (
    | 'variant01'
    | 'variant02'
    | 'variant03'
    | 'variant04'
    | 'variant05'
    | 'variant06'
  )[];
  beard?: (
    | 'variant01'
    | 'variant02'
  )[];
  beardProbability?: number;
  mouth?: (
    | 'happy01'
    | 'happy02'
    | 'happy03'
    | 'happy04'
    | 'happy05'
    | 'happy06'
    | 'happy07'
    | 'happy08'
    | 'happy18'
    | 'happy09'
    | 'happy10'
    | 'happy11'
    | 'happy12'
    | 'happy13'
    | 'happy14'
    | 'happy17'
    | 'happy15'
    | 'happy16'
    | 'sad01'
    | 'sad02'
    | 'sad03'
    | 'sad04'
    | 'sad05'
    | 'sad06'
    | 'sad07'
    | 'sad08'
    | 'sad09'
  )[];
  glasses?: (
    | 'variant01'
    | 'variant02'
    | 'variant03'
    | 'variant04'
    | 'variant05'
  )[];
  glassesProbability?: number;
  hairColor?: string[];
  skinColor?: string[];
  earringsColor?: string[];
  eyebrowsColor?: string[];
  eyesColor?: string[];
  frecklesColor?: string[];
  glassesColor?: string[];
  mouthColor?: string[];
  noseColor?: string[];
  hairAccessoriesColor?: string[];
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
