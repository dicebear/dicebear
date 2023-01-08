/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/tyuOazZuFlU6tAF9xmJTSM
 */

export interface Options {
  mouth?: (
    | 'plain'
    | 'lilSmile'
    | 'sad'
    | 'shy'
    | 'cute'
    | 'wideSmile'
    | 'shout'
    | 'smileTeeth'
    | 'smileLol'
    | 'pissed'
    | 'drip'
    | 'tongueOut'
    | 'kissHeart'
    | 'sick'
    | 'faceMask'
  )[];
  eyes?: (
    | 'sad'
    | 'tearDrop'
    | 'pissed'
    | 'cute'
    | 'wink'
    | 'wink2'
    | 'plain'
    | 'glasses'
    | 'closed'
    | 'love'
    | 'stars'
    | 'shades'
    | 'closed2'
    | 'crying'
    | 'sleepClose'
  )[];
  backgroundColor?: string[];
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
