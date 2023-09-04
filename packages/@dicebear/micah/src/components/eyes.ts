/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const eyes: ComponentGroup = {
  'eyes': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g fill="${escape.xml(`${colors.eyes}`)}"><ellipse cx="16.53" cy="29.4" rx="9" ry="13.5" transform="rotate(-6.78 16.53 29.4)"/><ellipse cx="80.53" cy="19.4" rx="9" ry="13.5" transform="rotate(-6.28 80.53 19.4)"/></g><g transform="translate(-40 -8)">${components.glasses?.value(components, colors) ?? ''}</g>`,
  'round': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g fill="${escape.xml(`${colors.eyes}`)}"><ellipse cx="16.12" cy="28.93" rx="9" ry="10" transform="rotate(-6.78 16.12 28.93)"/><ellipse cx="80.15" cy="18.92" rx="9" ry="10" transform="rotate(-6.28 80.15 18.92)"/></g><g transform="translate(-40 -8)">${components.glasses?.value(components, colors) ?? ''}</g>`,
  'eyesShadow': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="15.24" cy="20.24" r="12" transform="rotate(-6.28 15.24 20.24)" fill="${escape.xml(`${colors.eyeShadow}`)}"/><ellipse cx="16.53" cy="29.4" rx="9" ry="13.5" transform="rotate(-6.78 16.53 29.4)" fill="${escape.xml(`${colors.eyes}`)}"/><circle cx="79.02" cy="11.61" r="12" transform="rotate(-6.28 79.02 11.61)" fill="${escape.xml(`${colors.eyeShadow}`)}"/><ellipse cx="80.53" cy="19.4" rx="9" ry="13.5" transform="rotate(-6.28 80.53 19.4)" fill="${escape.xml(`${colors.eyes}`)}"/><g transform="translate(-40 -8)">${components.glasses?.value(components, colors) ?? ''}</g>`,
  'smiling': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M5.29 34.07c.11.82 1.14 1 1.72.41 2.46-2.52 6.25-4.36 10.65-4.89 2.6-.3 5.1-.12 7.32.48.75.2 1.5-.44 1.23-1.17A10.84 10.84 0 0 0 5.3 34.07ZM69.38 24.07c.12.82 1.15 1 1.73.41 2.44-2.48 6.19-4.3 10.54-4.83 2.56-.3 5.03-.12 7.23.47.75.2 1.5-.44 1.23-1.17a10.74 10.74 0 0 0-20.73 5.12Z" fill="${escape.xml(`${colors.eyes}`)}"/><g transform="translate(-40 -8)">${components.glasses?.value(components, colors) ?? ''}</g>`,
  'smilingShadow': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M26.47 24.36c1.86 6.36-5.04 1.48-11.4 3.33-6.36 1.86-9.78 9.76-11.64 3.4a12 12 0 0 1 23.04-6.73ZM90.26 15.17c1.64 6.42-4.7 1.52-11.11 3.15-6.43 1.64-10.51 9.19-12.15 2.77a12 12 0 1 1 23.26-5.92Z" fill="${escape.xml(`${colors.eyeShadow}`)}"/><path d="M5.29 34.07c.11.82 1.14 1 1.72.41 2.46-2.52 6.25-4.36 10.65-4.89 2.6-.3 5.1-.12 7.32.48.75.2 1.5-.44 1.23-1.17A10.84 10.84 0 0 0 5.3 34.07ZM69.38 24.07c.12.82 1.15 1 1.73.41 2.44-2.48 6.19-4.3 10.54-4.83 2.56-.3 5.03-.12 7.23.47.75.2 1.5-.44 1.23-1.17a10.74 10.74 0 0 0-20.73 5.12Z" fill="${escape.xml(`${colors.eyes}`)}"/><g transform="translate(-40 -8)">${components.glasses?.value(components, colors) ?? ''}</g>`,
}
