export type FrameSettings = {
  title: string;
  packageName: string;
  packageVersion: string;
  creator: string;
  contributor: string;
  sourceTitle: string;
  source: string;
  licenseName: string;
  licenseUrl: string;
  backgroundColorGroupName: string;
  shapeRendering: string;
  onPreCreateHook: string;
  onPostCreateHook: string;
  precision: number;
};

export type ComponentGroupSettings = {
  defaults: Record<string, boolean>;
  probability: number | null;
};

export type ExportComponent = {
  id: string;
  name: string;
};

export type ColorGroupSettings = {
  defaults: Record<string, boolean>;
};

export type ExportColor = {
  id: string;
  name: string;
  value: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
};

export type ExportComponentGroup = {
  settings: ComponentGroupSettings;
  collection: Record<string, ExportComponent>;
};

export type ExportColorGroup = {
  isUsedByComponents: boolean;
  settings: ColorGroupSettings;
  collection: Record<string, ExportColor>;
};

export type Export = {
  frame: {
    id: string;
    settings: FrameSettings;
  };
  components: Record<string, ExportComponentGroup>;
  colors: Record<string, ExportColorGroup>;
};

export type NodeExportInfo = {
  matrix?: {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
  };
  scale?: {
    x: number;
    y: number;
  };
  fillColorGroup?: string;
  strokeColorGroup?: string;
  componentGroup?: string;
};
