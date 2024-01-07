/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic/%40dicebear%2Fshapes
 */

export interface Options {
  shape1?: (
    | 'rectangle'
    | 'rectangleFilled'
    | 'ellipseFilled'
    | 'ellipse'
    | 'polygonFilled'
    | 'polygon'
    | 'line'
  )[];
  shape1Rotation?: number[];
  shape1OffsetX?: number[];
  shape1OffsetY?: number[];
  shape2?: (
    | 'rectangle'
    | 'rectangleFilled'
    | 'ellipseFilled'
    | 'ellipse'
    | 'polygonFilled'
    | 'polygon'
    | 'line'
  )[];
  shape2Rotation?: number[];
  shape2OffsetX?: number[];
  shape2OffsetY?: number[];
  shape3?: (
    | 'rectangle'
    | 'rectangleFilled'
    | 'ellipseFilled'
    | 'ellipse'
    | 'polygonFilled'
    | 'polygon'
    | 'line'
  )[];
  shape3Rotation?: number[];
  shape3OffsetX?: number[];
  shape3OffsetY?: number[];
  backgroundColor?: string[];
  shape1Color?: string[];
  shape2Color?: string[];
  shape3Color?: string[];
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
      rotation: number | undefined;
      offsetX: number | undefined;
      offsetY: number | undefined;
    }
  | undefined;
