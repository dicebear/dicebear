/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringFour: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M40.5 50a9.47 9.47 0 0 1 2.782-6.718l-7.424-7.424A19.937 19.937 0 0 0 30 50h10.5Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 30c-11.046 0-20 8.954-20 20h10.5a9.5 9.5 0 0 1 9.5-9.5V30Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M70 50c0-11.046-8.954-20-20-20s-20 8.954-20 20h10.5a9.5 9.5 0 0 1 19 0H70Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="14.75" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10.5"/>`,
}
