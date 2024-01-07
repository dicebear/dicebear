/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const base: ComponentGroup = {
  standard: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M154 319.5c-14.4-20-25.67-58.67-27-78L58.5 212 30 319.5h124Z" fill="${escape.xml(
      `${colors.base}`
    )}" stroke="#000" stroke-width="4"/><path d="M130.37 263.69c-2.1.2-4.22.31-6.37.31-30.78 0-56.05-21.57-58.76-49.1L127 241.5c.38 5.48 1.55 13.32 3.37 22.19Z" fill="#000" style="mix-blend-mode:multiply"/><path d="M181.94 151.37v.01l.1.4.14.65A75.72 75.72 0 0 1 34.93 187.7l-.2-.74L18 117.13l-.06-.29A75.72 75.72 0 0 1 165.2 81.55l.05.21.02.08.05.2.05.2v.01l16.4 68.44.08.34.08.34Z" fill="${escape.xml(
      `${colors.base}`
    )}" stroke="#000" stroke-width="4"/><g transform="translate(34 102.3)">${
      components.facialHair?.value(components, colors) ?? ''
    }</g>`,
};
