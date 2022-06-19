/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL/%40dicebear%2Fmicah?node-id=259%3A555
 */

export interface Options {
  base?: (
    | 'standard'
  )[];
  mouth?: (
    | 'surprised'
    | 'laughing'
    | 'nervous'
    | 'smile'
    | 'sad'
    | 'pucker'
    | 'frown'
    | 'smirk'
  )[];
  eyebrows?: (
    | 'up'
    | 'down'
    | 'eyelashesUp'
    | 'eyelashesDown'
  )[];
  hair?: (
    | 'fonze'
    | 'mrT'
    | 'dougFunny'
    | 'mrClean'
    | 'dannyPhantom'
    | 'full'
    | 'turban'
    | 'pixie'
  )[];
  hairProbability?: number;
  eyes?: (
    | 'eyes'
    | 'round'
    | 'eyesShadow'
    | 'smiling'
  )[];
  nose?: (
    | 'curve'
    | 'pointed'
    | 'tound'
  )[];
  ears?: (
    | 'attached'
    | 'detached'
  )[];
  shirt?: (
    | 'open'
    | 'crew'
    | 'collared'
  )[];
  earrings?: (
    | 'hoop'
    | 'stud'
  )[];
  earringsProbability?: number;
  glasses?: (
    | 'round'
    | 'square'
  )[];
  glassesProbability?: number;
  facialHair?: (
    | 'beard'
    | 'scruff'
  )[];
  facialHairProbability?: number;
  baseColor?: string[];
  earringColor?: string[];
  eyeShadowColor?: string[];
  eyebrowsColor?: string[];
  facialHairColor?: string[];
  glassesColor?: string[];
  hairColor?: string[];
  mouthColor?: string[];
  shirtColor?: string[];
  eyesColor?: string[];
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
