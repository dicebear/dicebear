/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const eyebrows: ComponentGroup = {
  'up': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M99 10.21c5.67-2.66 19-5.1 27 6.5M23.58 35.52c2.07-5.9 9.68-17.12 23.56-14.7" stroke="${escape.xml(`${colors.eyebrows}`)}" stroke-width="4" stroke-linecap="round"/>`,
  'down': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M27 26.5c6.17 2.5 21.1 3 31.5-15M94 4c5.17 5.33 18.1 12.8 28.5 0" stroke="${escape.xml(`${colors.eyebrows}`)}" stroke-width="4" stroke-linecap="round"/>`,
  'eyelashesUp': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M99 10.21c5.67-2.66 19-5.1 27 6.5M23.58 35.52c2.07-5.9 9.68-17.12 23.56-14.7M26.07 29.46l-6.14-5.43M122.96 11.16l6.15-5.43M32.52 23.81l-4.04-7.13M115.51 7.51l4.05-7.13M40.6 20.2l-2.2-7.9M106.44 6.9l2.2-7.9" stroke="${escape.xml(`${colors.eyebrows}`)}" stroke-width="4" stroke-linecap="round"/>`,
  'eyelashesDown': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M27 26.5c6.17 2.5 21.1 3 31.5-15M94 4c5.17 5.33 18.1 12.8 28.5 0M37.15 26.46 31 21.03M116.22 9.44l1.78-8M45.6 22.81l-4.05-7.13M108.14 9.02l.94-8.15M52.67 17.2l-2.2-7.9M100 8.03l-.78-8.16" stroke="${escape.xml(`${colors.eyebrows}`)}" stroke-width="4" stroke-linecap="round"/>`,
}
