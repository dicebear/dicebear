/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const ringFive: ComponentGroup = {
  eighth: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="m42.929 42.929 7.07 7.07H40a9.97 9.97 0 0 1 2.93-7.07Z" fill="${escape.xml(
      `${colors.ring}`
    )}"/>`,
  quarter: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M50 40v10H40c0-5.523 4.477-10 10-10Z" fill="${escape.xml(
      `${colors.ring}`
    )}"/>`,
  half: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M60 50c0-5.523-4.477-10-10-10s-10 4.477-10 10h20Z" fill="${escape.xml(
      `${colors.ring}`
    )}"/>`,
  full: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<circle cx="50" cy="50" r="10" fill="${escape.xml(`${colors.ring}`)}"/>`,
};
