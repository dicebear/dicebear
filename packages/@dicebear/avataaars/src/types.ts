/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

export interface Options {
  style?: ('circle' | 'default')[];
  base?: ('default')[];
  clothing?: (
    | 'blazerAndShirt'
    | 'blazerAndSweater'
    | 'collarAndSweater'
    | 'graphicShirt'
    | 'hoodie'
    | 'overall'
    | 'shirtCrewNeck'
    | 'shirtScoopNeck'
    | 'shirtVNeck'
  )[];
  mouth?: (
    | 'concerned'
    | 'default'
    | 'disbelief'
    | 'eating'
    | 'grimace'
    | 'sad'
    | 'screamOpen'
    | 'serious'
    | 'smile'
    | 'tongue'
    | 'twinkle'
    | 'vomit'
  )[];
  nose?: ('default')[];
  eyes?: (
    | 'closed'
    | 'cry'
    | 'default'
    | 'eyeRoll'
    | 'happy'
    | 'hearts'
    | 'side'
    | 'squint'
    | 'surprised'
    | 'winkWacky'
    | 'wink'
    | 'xDizzy'
  )[];
  eyebrows?: (
    | 'angryNatural'
    | 'defaultNatural'
    | 'flatNatural'
    | 'frownNatural'
    | 'raisedExcitedNatural'
    | 'sadConcernedNatural'
    | 'unibrowNatural'
    | 'upDownNatural'
    | 'angry'
    | 'default'
    | 'raisedExcited'
    | 'sadConcerned'
    | 'upDown'
  )[];
  top?: (
    | 'hat'
    | 'hijab'
    | 'turban'
    | 'winterHat1'
    | 'winterHat02'
    | 'winterHat03'
    | 'winterHat04'
    | 'bob'
    | 'bun'
    | 'curly'
    | 'curvy'
    | 'dreads'
    | 'frida'
    | 'fro'
    | 'froBand'
    | 'longButNotTooLong'
    | 'miaWallace'
    | 'shavedSides'
    | 'straight02'
    | 'straight01'
    | 'straightAndStrand'
    | 'dreads01'
    | 'dreads02'
    | 'frizzle'
    | 'shaggy'
    | 'shaggyMullet'
    | 'shortCurly'
    | 'shortFlat'
    | 'shortRound'
    | 'shortWaved'
    | 'sides'
    | 'theCaesar'
    | 'theCaesarAndSidePart'
    | 'bigHair'
  )[];
  topProbability?: number;
  facialHair?: (
    | 'beardLight'
    | 'beardMajestic'
    | 'beardMedium'
    | 'moustacheFancy'
    | 'moustacheMagnum'
  )[];
  facialHairProbability?: number;
  accessories?: (
    | 'kurt'
    | 'prescription01'
    | 'prescription02'
    | 'round'
    | 'sunglasses'
    | 'wayfarers'
    | 'eyepatch'
  )[];
  accessoriesProbability?: number;
  clothingGraphic?: (
    | 'bat'
    | 'bear'
    | 'cumbia'
    | 'deer'
    | 'diamond'
    | 'hola'
    | 'pizza'
    | 'resist'
    | 'skull'
    | 'skullOutline'
  )[];
  accessoriesColor?: string[];
  clothesColor?: string[];
  hatColor?: string[];
  hairColor?: string[];
  skinColor?: string[];
  facialHairColor?: string[];
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
