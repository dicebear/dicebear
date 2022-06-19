/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/np7zgQo9412LDvi1mA1UmK/%40dicebear%2Fidenticon?node-id=1%3A34
 */

export interface Options {
  row1?: (
    | 'xooox'
    | 'xxoxx'
    | 'xoxox'
    | 'oxxxo'
    | 'xxxxx'
    | 'oxoxo'
    | 'ooxoo'
  )[];
  row2?: (
    | 'xooox'
    | 'xxoxx'
    | 'xoxox'
    | 'oxxxo'
    | 'xxxxx'
    | 'oxoxo'
    | 'ooxoo'
  )[];
  row3?: (
    | 'xooox'
    | 'xxoxx'
    | 'xoxox'
    | 'oxxxo'
    | 'xxxxx'
    | 'oxoxo'
    | 'ooxoo'
  )[];
  row4?: (
    | 'xooox'
    | 'xxoxx'
    | 'xoxox'
    | 'oxxxo'
    | 'xxxxx'
    | 'oxoxo'
    | 'ooxoo'
  )[];
  row5?: (
    | 'xooox'
    | 'xxoxx'
    | 'xoxox'
    | 'oxxxo'
    | 'xxxxx'
    | 'oxoxo'
    | 'ooxoo'
  )[];
  rowColor?: string[];
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
