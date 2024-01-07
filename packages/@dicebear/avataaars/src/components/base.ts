/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const base: ComponentGroup = {
  default: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M132 36a56 56 0 0 0-56 56v6.17A12 12 0 0 0 66 110v14a12 12 0 0 0 10.3 11.88 56.04 56.04 0 0 0 31.7 44.73v18.4h-4a72 72 0 0 0-72 72v9h200v-9a72 72 0 0 0-72-72h-4v-18.39a56.04 56.04 0 0 0 31.7-44.73A12 12 0 0 0 198 124v-14a12 12 0 0 0-10-11.83V92a56 56 0 0 0-56-56Z" fill="${escape.xml(
      `${colors.skin}`
    )}"/><path d="M108 180.61v8a55.79 55.79 0 0 0 24 5.39c8.59 0 16.73-1.93 24-5.39v-8a55.79 55.79 0 0 1-24 5.39 55.79 55.79 0 0 1-24-5.39Z" fill="#000" fill-opacity=".1"/><g transform="translate(0 170)">${
      components.clothing?.value(components, colors) ?? ''
    }</g><g transform="translate(78 134)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(104 122)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(76 90)">${
      components.eyes?.value(components, colors) ?? ''
    }</g><g transform="translate(76 82)">${
      components.eyebrows?.value(components, colors) ?? ''
    }</g><g transform="translate(-1)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(49 72)">${
      components.facialHair?.value(components, colors) ?? ''
    }</g><g transform="translate(62 42)">${
      components.accessories?.value(components, colors) ?? ''
    }</g>`,
};
