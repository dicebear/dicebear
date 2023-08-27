/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

export interface Options {
  ring?: (
    | 'container'
  )[];
  ringRotation?: number[];
  ringOne?: (
    | 'half'
    | 'quarter'
    | 'eighth'
    | 'full'
  )[];
  ringOneRotation?: number[];
  ringTwo?: (
    | 'eighth'
    | 'quarter'
    | 'half'
    | 'full'
  )[];
  ringTwoRotation?: number[];
  ringThree?: (
    | 'eighth'
    | 'quarter'
    | 'half'
    | 'full'
  )[];
  ringThreeRotation?: number[];
  ringFour?: (
    | 'eighth'
    | 'quarter'
    | 'half'
    | 'full'
  )[];
  ringFourRotation?: number[];
  ringFive?: (
    | 'eighth'
    | 'quarter'
    | 'half'
    | 'full'
  )[];
  ringFiveRotation?: number[];
  ringColor?: string[];
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
      rotation: number | undefined,
      offsetX: number | undefined,
      offsetY: number | undefined,
    }
  | undefined;
