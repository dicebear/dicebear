export interface Options {
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
  backgroundColor?: string[];
  hairColor?: string[];
  mouthColor?: string[];
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
