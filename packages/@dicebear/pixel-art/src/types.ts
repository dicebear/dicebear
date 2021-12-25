export interface Options {
  beard?: ('variant04' | 'variant03' | 'variant02' | 'variant01')[];
  beardProbability?: number;
  eyes?: (
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
  mouth?: (
    | 'surprised03'
    | 'surprised02'
    | 'happy09'
    | 'happy08'
    | 'happy07'
    | 'happy06'
    | 'happy05'
    | 'happy04'
    | 'happy03'
    | 'happy02'
    | 'happy01'
    | 'sad08'
    | 'sad07'
    | 'sad06'
    | 'sad05'
    | 'sad04'
    | 'sad03'
    | 'sad02'
    | 'sad01'
    | 'surprised01'
  )[];
  hair?: (
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
    | 'long15'
    | 'short01'
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
  hairProbability?: number;
  accessories?: ('variant04' | 'variant03' | 'variant02' | 'variant01')[];
  accessoriesProbability?: number;
  glasses?: (
    | 'variant07'
    | 'variant06'
    | 'variant05'
    | 'variant04'
    | 'variant03'
    | 'variant02'
    | 'variant01'
  )[];
  glassesProbability?: number;
  hat?: (
    | 'variant01'
    | 'variant02'
    | 'variant03'
    | 'variant04'
    | 'variant05'
    | 'variant06'
    | 'variant07'
    | 'variant08'
    | 'variant09'
    | 'variant10'
    | 'variant11'
    | 'variant12'
  )[];
  hatProbability?: number;
  clothing?: (
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
  skinColor?: string[];
  hairColor?: string[];
  accessoriesColor?: string[];
  mouthColor?: string[];
  clothesColor?: string[];
  hatColor?: string[];
  glassesColor?: string[];
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
