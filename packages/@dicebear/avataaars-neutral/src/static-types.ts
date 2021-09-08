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
export type ComponentGroupItem = (components: ComponentPickCollection, colors: ColorPickCollection) => string;
export type ComponentPickCollection = Record<string, ComponentPick>;
export type ComponentPick =
  | {
      name: string;
      value: ComponentGroupItem;
    }
  | undefined;
