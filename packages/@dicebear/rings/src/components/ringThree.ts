/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringThree: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M30.5 50c0-5.385 2.183-10.26 5.711-13.789l-7.424-7.424C23.357 34.216 20 41.716 20 50h10.5Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 20c-16.569 0-30 13.431-30 30h10.5c0-10.77 8.73-19.5 19.5-19.5V20Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M80 50c0-16.569-13.431-30-30-30-16.569 0-30 13.431-30 30h10.5c0-10.77 8.73-19.5 19.5-19.5S69.5 39.23 69.5 50H80Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="24.75" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10.5"/>`,
}
