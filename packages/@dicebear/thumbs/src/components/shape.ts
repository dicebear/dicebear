/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const shape: ComponentGroup = {
  'default': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M95 53.33C95 29.4 74.85 10 50 10S5 29.4 5 53.33V140h90V53.33Z" fill="${escape.xml(`${colors.shape}`)}"/><g transform="translate(29 33)">${components.face?.value(components, colors) ?? ''}</g>`,
}
