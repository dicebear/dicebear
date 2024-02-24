/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringThree: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M30 50a19.937 19.937 0 0 1 5.858-14.142l-7.071-7.071C23.357 34.216 20 41.716 20 50h10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 20c-16.569 0-30 13.431-30 30h10c0-11.046 8.954-20 20-20V20Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M80 50c0-16.569-13.431-30-30-30-16.569 0-30 13.431-30 30h10c0-11.046 8.954-20 20-20s20 8.954 20 20h10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="25" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10"/>`,
}
