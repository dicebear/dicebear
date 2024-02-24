/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringTwo: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M20 50c0-8.284 3.358-15.784 8.787-21.213l-7.071-7.071C14.477 28.954 10 38.954 10 50h10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 10c-22.091 0-40 17.909-40 40h10c0-16.569 13.431-30 30-30V10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M90 50c0-22.091-17.909-40-40-40S10 27.909 10 50h10c0-16.569 13.431-30 30-30 16.569 0 30 13.431 30 30h10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="35" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10"/>`,
}
