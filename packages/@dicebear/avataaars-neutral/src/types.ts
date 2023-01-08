/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

export interface Options {
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
  nose?: (
    | 'default'
  )[];
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
