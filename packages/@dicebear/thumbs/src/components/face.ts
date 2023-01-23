/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv/%40dicebear%2Fthumbs
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const face: ComponentGroup = {
  'variant1': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g transform="translate(0 5)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(6 23)">${components.mouth?.value(components, colors) ?? ''}</g>`,
  'variant2': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g transform="translate(0 4)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(6 24)">${components.mouth?.value(components, colors) ?? ''}</g>`,
  'variant3': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g transform="translate(0 3)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(6 25)">${components.mouth?.value(components, colors) ?? ''}</g>`,
  'variant5': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g transform="translate(0 1)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(6 27)">${components.mouth?.value(components, colors) ?? ''}</g>`,
  'variant4': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g transform="translate(0 2)">${components.eyes?.value(components, colors) ?? ''}</g><g transform="translate(6 26)">${components.mouth?.value(components, colors) ?? ''}</g>`,
}
