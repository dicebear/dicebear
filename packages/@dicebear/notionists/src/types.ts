/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/gpLBQuklPE2XsOskwwv7QW
 */

export interface Options {
  base?: (
    | 'variant01'
  )[];
  body?: (
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
  hair?: (
    | 'variant63'
    | 'variant62'
    | 'variant61'
    | 'variant60'
    | 'variant59'
    | 'variant58'
    | 'variant57'
    | 'variant56'
    | 'variant55'
    | 'variant54'
    | 'variant53'
    | 'variant52'
    | 'variant51'
    | 'variant50'
    | 'variant49'
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
    | 'hat'
  )[];
  lips?: (
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
  beard?: (
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
  beardProbability?: number;
  nose?: (
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
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  glasses?: (
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
  glassesProbability?: number;
  brows?: (
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
  gesture?: (
    | 'wavePointLongArms'
    | 'waveOkLongArms'
    | 'waveLongArms'
    | 'waveLongArm'
    | 'pointLongArm'
    | 'okLongArm'
    | 'point'
    | 'ok'
    | 'hand'
    | 'handPhone'
  )[];
  gestureProbability?: number;
  bodyIcon?: (
    | 'electric'
    | 'saturn'
    | 'galaxy'
  )[];
  bodyIconProbability?: number;
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
