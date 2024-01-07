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

export const glasses: ComponentGroup = {
  round: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g stroke="${escape.xml(
      `${colors.glasses}`
    )}" stroke-width="4"><circle cx="122.5" cy="28" r="26"/><circle cx="55.5" cy="37" r="26"/><path d="M97.5 35a8 8 0 0 0-16 0M30 39 0 44.5"/></g>`,
  square: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g stroke="${escape.xml(
      `${colors.glasses}`
    )}" stroke-width="4"><path d="M34.5 42.5 0 49.12" stroke-linecap="round"/><path d="M35.47 18.53 74.2 13.1a6 6 0 0 1 6.77 5.1l5.57 39.62a6 6 0 0 1-5.1 6.78l-34.48 4.84a6 6 0 0 1-6.65-4.48l-9.81-39.01a6 6 0 0 1 4.98-7.4ZM145.92 3.22 107.2 8.66a6 6 0 0 0-5.1 6.78l5.56 39.6a6 6 0 0 0 6.78 5.11l34.47-4.84a6 6 0 0 0 5.16-6.14l-1.32-40.2a6 6 0 0 0-6.83-5.75ZM83.5 37.12l22-3.5"/></g>`,
};
