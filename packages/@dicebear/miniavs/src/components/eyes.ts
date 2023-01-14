/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/Vh7N9shKJTNHNo9prUzkZe
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const eyes: ComponentGroup = {
  'normal': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g fill="${escape.xml(`${colors.hair}`)}"><rect x="30" y="36" width="3" height="4" rx="1.5"/><rect x="40" y="36" width="3" height="4" rx="1.5"/></g>${components.blushes?.value(components, colors) ?? ''}`,
  'confident': (components: ComponentPickCollection, colors: ColorPickCollection) => `${components.blushes?.value(components, colors) ?? ''}<path d="M43 37.5a1.5 1.5 0 0 1-3 0v-1.23c0-.15.12-.27.27-.27h2.46c.15 0 .27.12.27.27v1.23ZM33 37.5a1.5 1.5 0 0 1-3 0v-1.23c0-.15.12-.27.27-.27h2.46c.15 0 .27.12.27.27v1.23Z" fill="${escape.xml(`${colors.hair}`)}"/><path stroke="${escape.xml(`${colors.hair}`)}" stroke-linecap="round" d="M29.5 36.5h4M39.5 36.5h4"/>`,
  'happy': (components: ComponentPickCollection, colors: ColorPickCollection) => `${components.blushes?.value(components, colors) ?? ''}<path d="M30 37.5a1.5 1.5 0 0 1 3 0v1.23c0 .15-.12.27-.27.27h-2.46a.27.27 0 0 1-.27-.27V37.5ZM40 37.5a1.5 1.5 0 0 1 3 0v1.23c0 .15-.12.27-.27.27h-2.46a.27.27 0 0 1-.27-.27V37.5Z" fill="#1B0B47"/>`,
}
