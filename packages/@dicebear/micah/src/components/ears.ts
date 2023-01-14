/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ears: ComponentGroup = {
  'attached': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M30.5 6.18A23.78 23.78 0 0 0 23.08 5c-10.5 0-19 6.5-18 18.5 1.04 12.5 8.5 17 19 17A19.6 19.6 0 0 0 31 39.23" stroke="#000" stroke-width="8"/><path d="M31.5 39.04a19.38 19.38 0 0 1-7.42 1.46c-10.5 0-17.96-4.5-19-17-1-12 7.5-18.5 18-18.5 3.14 0 6.19.6 8.92 1.73l-.5 32.3Z" fill="${escape.xml(`${colors.base}`)}"/><path d="M27.5 13.5c-4-1.83-12.8-2.8-16 8" stroke="#000" stroke-width="4"/><path d="M17 14c2.17 1.83 6.3 7.5 5.5 15.5" stroke="#000" stroke-width="4"/><g transform="translate(3 35)">${components.earrings?.value(components, colors) ?? ''}</g>`,
  'detached': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M37 8.25V7.13l-.95-.59A24.91 24.91 0 0 0 23.08 3C17.44 3 12.16 4.75 8.4 8.3c-3.8 3.58-5.86 8.83-5.31 15.37.52 6.37 2.66 11.06 6.2 14.17-.29 1-.37 2.08-.24 3.21a8.98 8.98 0 0 0 4.6 7.08C16.09 49.5 19.2 50 22.52 50c5.48 0 10.29-2.95 13.95-6.89l.53-.57V8.25Z" stroke="#000" stroke-width="4"/><path d="M42.97 23.98c.07-.65.1-1.3.1-1.98 0-10.22-9.5-17-20-17C12.6 5 4.09 11.5 5.09 23.5c.56 6.68 2.95 11.07 6.65 13.72a5.7 5.7 0 0 0-.68 3.6C11.68 46.1 16.19 48 22.52 48c11.1 0 19.9-14.05 20.45-24.02Z" fill="${escape.xml(`${colors.base}`)}"/><path d="M27.5 13.5c-4-1.83-12.8-2.8-16 8" stroke="#000" stroke-width="4"/><path d="M17 14c2.17 1.83 6.3 7.5 5.5 15.5" stroke="#000" stroke-width="4"/><g transform="translate(3 42)">${components.earrings?.value(components, colors) ?? ''}</g>`,
}
