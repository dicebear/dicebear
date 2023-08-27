/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringOne: ComponentGroup = {
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M89.5 50H100c0-27.614-22.386-50-50-50S0 22.386 0 50h10.5c0-21.815 17.685-39.5 39.5-39.5S89.5 28.185 89.5 50Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 10.5V0C22.386 0 0 22.386 0 50h10.5c0-21.815 17.685-39.5 39.5-39.5Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M22.07 22.07C14.92 29.216 10.5 39.091 10.5 50H0c0-13.807 5.596-26.307 14.645-35.355l7.424 7.424Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="44.75" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10.5"/>`,
}
