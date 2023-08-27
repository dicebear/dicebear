/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sK2mrFhCZwQu1qw4WqOBEF/%40dicebear%2Frings
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const ring: ComponentGroup = {
  'container': (components: ComponentPickCollection, colors: ColorPickCollection) => `${components.ringOne?.value(components, colors) ?? ''}${components.ringTwo?.value(components, colors) ?? ''}${components.ringThree?.value(components, colors) ?? ''}${components.ringFour?.value(components, colors) ?? ''}${components.ringFive?.value(components, colors) ?? ''}<g transform="matrix(1 0 0 -1 0 100)">${components.ringOne?.value(components, colors) ?? ''}</g><g transform="matrix(1 0 0 -1 0 100)">${components.ringTwo?.value(components, colors) ?? ''}</g><g transform="matrix(1 0 0 -1 0 100)">${components.ringThree?.value(components, colors) ?? ''}</g><g transform="matrix(1 0 0 -1 0 100)">${components.ringFour?.value(components, colors) ?? ''}</g><g transform="matrix(1 0 0 -1 0 100)">${components.ringFive?.value(components, colors) ?? ''}</g>`,
}
