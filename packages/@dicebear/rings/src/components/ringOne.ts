/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringOne: ComponentGroup = {
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 10c22.091 0 40 17.909 40 40h10c0-27.614-22.386-50-50-50S0 22.386 0 50h10c0-22.091 17.909-40 40-40Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 10V0C22.386 0 0 22.386 0 50h10c0-22.091 17.909-40 40-40Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="m21.716 21.716-7.071-7.071C5.602 23.688.007 36.178 0 49.975V50h10c0-11.046 4.477-21.046 11.716-28.284Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="45" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10"/>`,
}
