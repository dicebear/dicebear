/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/4nf3pyoOuM1U9Pa8M0cL6u
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const face: ComponentGroup = {
  round01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="faceRound01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><path fill-rule="evenodd" clip-rule="evenodd" d="M66 0c58.35 0 64 40.69 64 78 0 33.31-25.47 42-64 42-37.46 0-66-8.69-66-42C0 40.69 7.65 0 66 0Z" fill="#fff"/></mask><g mask="url(#faceRound01-a)"><path d="M-4-2h138v124H-4V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
  round02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="faceRound02-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 31v-1c.18-.48.4-1.5 1-3 .83-3.06 2.78-6.56 6-10C16.7 6.6 35.17 0 65 0s48.3 6.6 58 17c3.22 3.44 5.17 6.94 6 10 .6 1.5.82 2.52 1 3v40c0-.1-.03.5 0 1a53.93 53.93 0 0 1-1 6c-1.19 6-3.4 11.91-7 17-9.72 16.34-27.74 26-57 26s-47.28-9.66-57-26C4.4 88.91 2.2 83 1 77a53.95 53.95 0 0 1-1-6c.03-.45 0-1.32 0-1V31Z" fill="#fff"/></mask><g mask="url(#faceRound02-a)"><path d="M-4-2h138v124H-4V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
  square01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="faceSquare01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><rect width="130" height="120" rx="18" fill="#fff"/></mask><g mask="url(#faceSquare01-a)"><path d="M-2-2h134v124H-2V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
  square02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="faceSquare02-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><path d="M0 12A12 12 0 0 1 12 0h106a12 12 0 0 1 12 12v70a38 38 0 0 1-38 38H38A38 38 0 0 1 0 82V12Z" fill="#fff"/></mask><g mask="url(#faceSquare02-a)"><path d="M-2-2h134v124H-2V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
  square03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="faceSquare03-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 18A18 18 0 0 1 18 0h94a18 18 0 0 1 18 18v27.15a40 40 0 0 1-2.28 13.31L110.24 108a18 18 0 0 1-16.98 12H36.74a18 18 0 0 1-16.98-12L2.28 58.45A40 40 0 0 1 0 45.15V18Z" fill="#fff"/></mask><g mask="url(#faceSquare03-a)"><path d="M-2-2h134v124H-2V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
  square04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="faceSquare04-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 102V68.85a40 40 0 0 1 2.28-13.31L19.76 12A18 18 0 0 1 36.74 0h56.52a18 18 0 0 1 16.98 12l17.48 43.54A40 40 0 0 1 130 68.85V102a18 18 0 0 1-18 18H18a18 18 0 0 1-18-18Z" fill="#fff"/></mask><g mask="url(#faceSquare04-a)"><path d="M-2-2h134v124H-2V-2Z" fill="${escape.xml(
      `${colors.base}`
    )}"/><g transform="translate(-1 -1)">${
      components.texture?.value(components, colors) ?? ''
    }</g></g>`,
};
