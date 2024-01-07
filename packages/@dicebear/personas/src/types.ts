/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/oa0iScDLrh1tVFzSud2Dwc
 */

export interface Options {
  eyes?: ('open' | 'sleep' | 'wink' | 'glasses' | 'happy' | 'sunglasses')[];
  hair?: (
    | 'long'
    | 'sideShave'
    | 'shortCombover'
    | 'curlyHighTop'
    | 'bobCut'
    | 'curly'
    | 'pigtails'
    | 'curlyBun'
    | 'buzzcut'
    | 'bobBangs'
    | 'bald'
    | 'balding'
    | 'cap'
    | 'bunUndercut'
    | 'fade'
    | 'beanie'
    | 'straightBun'
    | 'extraLong'
    | 'shortComboverChops'
    | 'mohawk'
  )[];
  body?: ('squared' | 'rounded' | 'small' | 'checkered')[];
  mouth?: (
    | 'smile'
    | 'frown'
    | 'surprise'
    | 'pacifier'
    | 'bigSmile'
    | 'smirk'
    | 'lips'
  )[];
  nose?: ('mediumRound' | 'smallRound' | 'wrinkles')[];
  facialHair?: (
    | 'beardMustache'
    | 'pyramid'
    | 'walrus'
    | 'goatee'
    | 'shadow'
    | 'soulPatch'
  )[];
  facialHairProbability?: number;
  hairColor?: string[];
  clothingColor?: string[];
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
