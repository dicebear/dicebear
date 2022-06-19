/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/KhTfMFWWniVgZmGVFL0KK6/%40dicebear%2Fbig-ears?node-id=202%3A1017
 */

export interface Options {
  hair?: (
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
  )[];
  face?: (
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
  mouth?: (
    | 'variant0708'
    | 'variant0707'
    | 'variant0706'
    | 'variant0705'
    | 'variant0704'
    | 'variant0703'
    | 'variant0702'
    | 'variant0701'
    | 'variant0405'
    | 'variant0605'
    | 'variant0604'
    | 'variant0603'
    | 'variant0602'
    | 'variant0601'
    | 'variant0505'
    | 'variant0504'
    | 'variant0503'
    | 'variant0502'
    | 'variant0501'
    | 'variant0404'
    | 'variant0403'
    | 'variant0402'
    | 'variant0401'
    | 'variant0305'
    | 'variant0304'
    | 'variant0303'
    | 'variant0302'
    | 'variant0301'
    | 'variant0205'
    | 'variant0204'
    | 'variant0203'
    | 'variant0202'
    | 'variant0201'
    | 'variant0105'
    | 'variant0104'
    | 'variant0103'
    | 'variant0102'
    | 'variant0101'
  )[];
  ear?: (
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
  cheek?: (
    | 'variant06'
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  cheekProbability?: number;
  nose?: (
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
  sideburn?: (
    | 'variant07'
    | 'variant06'
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  frontHair?: (
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
  hairColor?: string[];
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
