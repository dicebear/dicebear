/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ringTwo: ComponentGroup = {
  'eighth': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M20.5 50c0-8.146 3.302-15.521 8.64-20.86l-7.424-7.424C14.477 28.954 10 38.954 10 50h10.5Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'quarter': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M50 10c-22.091 0-40 17.909-40 40h10.5c0-16.292 13.208-29.5 29.5-29.5V10Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'half': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M90 50c0-22.091-17.909-40-40-40S10 27.909 10 50h10.5c0-16.292 13.208-29.5 29.5-29.5S79.5 33.708 79.5 50H90Z" fill="${escape.xml(`${colors.ring}`)}"/>`,
  'full': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="50" cy="50" r="34.75" stroke="${escape.xml(`${colors.ring}`)}" stroke-width="10.5"/>`,
}
