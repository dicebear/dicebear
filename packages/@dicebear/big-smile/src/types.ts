/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/3Te9c70BX2Aj4IUP35sWhF
 */

export interface Options {
  face?: (
    | 'base'
  )[];
  mouth?: (
    | 'openedSmile'
    | 'unimpressed'
    | 'gapSmile'
    | 'openSad'
    | 'teethSmile'
    | 'awkwardSmile'
    | 'braces'
    | 'kawaii'
  )[];
  eyes?: (
    | 'cheery'
    | 'normal'
    | 'confused'
    | 'starstruck'
    | 'winking'
    | 'sleepy'
    | 'sad'
    | 'angry'
  )[];
  hair?: (
    | 'shortHair'
    | 'mohawk'
    | 'wavyBob'
    | 'bowlCutHair'
    | 'curlyBob'
    | 'straightHair'
    | 'braids'
    | 'shavedHead'
    | 'bunHair'
    | 'froBun'
    | 'bangs'
    | 'halfShavedHead'
    | 'curlyShortHair'
  )[];
  accessories?: (
    | 'catEars'
    | 'glasses'
    | 'sailormoonCrown'
    | 'clownNose'
    | 'sleepMask'
    | 'sunglasses'
    | 'faceMask'
    | 'mustache'
  )[];
  accessoriesProbability?: number;
  skinColor?: string[];
  hairColor?: string[];
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
