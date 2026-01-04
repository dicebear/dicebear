/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 */

export interface Options {
  backhair?: (
    | 'longStraight'
    | 'longWavy'
    | 'shoulderHigh'
    | 'neckHigh'
  )[];
  backhairProbability?: number;
  body?: (
    | 'body'
  )[];
  head?: (
    | 'head'
  )[];
  clothes?: (
    | 'turtleNeck'
    | 'openJacket'
    | 'dress'
    | 'shirt'
  )[];
  mouth?: (
    | 'laugh'
    | 'angry'
    | 'agape'
    | 'smile'
    | 'sad'
  )[];
  beards?: (
    | 'moustache'
    | 'fullbeard'
    | 'chin'
    | 'chinMoustache'
    | 'longbeard'
  )[];
  beardsProbability?: number;
  eyes?: (
    | 'happy'
    | 'wide'
    | 'bow'
    | 'humble'
    | 'wink'
  )[];
  eyebrows?: (
    | 'raised'
    | 'angry'
    | 'happy'
    | 'sad'
    | 'neutral'
  )[];
  hair?: (
    | 'sideComed'
    | 'undercut'
    | 'spiky'
    | 'bun'
  )[];
  skinColor?: string[];
  hairColor?: string[];
  clothesColor?: string[];
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
