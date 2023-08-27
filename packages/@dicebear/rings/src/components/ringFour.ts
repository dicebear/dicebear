/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringFour: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 30c-11.046 0-20 8.954-20 20h10c0-5.523 4.477-10 10-10V30Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 30c-11.046 0-20 8.954-20 20h10c0-5.523 4.477-10 10-10V30Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M70 50c0-11.046-8.954-20-20-20s-20 8.954-20 20h10c0-5.523 4.477-10 10-10s10 4.477 10 10h10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="15" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10"/>`,
}
