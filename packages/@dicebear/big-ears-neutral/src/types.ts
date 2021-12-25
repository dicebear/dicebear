export interface Options {
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
  backgroundColor?: string[];
}

export type ColorGroup = Record<string, ColorGroupItem>;
export type ColorGroupCollection = Record<string, ColorGroup>;
export type ColorGroupItem = string;
export type ColorPickCollection = Record<string, ColorPick>;
export type ColorPick = {
  name: string;
  value: ColorGroupItem;
};

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
