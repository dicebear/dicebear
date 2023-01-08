/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const mouth: ComponentGroup = {
  'surprised': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M36.05 54.9c10.83-1.97 17.18-13.95 14.97-26.15-2.2-12.2-12.35-21.19-23.18-19.23C17 11.48 10.65 23.46 12.86 35.66c2.2 12.2 12.35 21.2 23.19 19.23Z" fill="${escape.xml(`#${colors.mouth}`)}" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="3.59"/><mask id="mouthSurprised-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="11" width="36" height="43"><ellipse cx="31.94" cy="32.21" rx="17.6" ry="21.26" transform="rotate(-10.26 31.94 32.2)" fill="#171921"/></mask><g mask="url(#mouthSurprised-a)"><ellipse cx="35.2" cy="50.22" rx="20.2" ry="18.3" transform="rotate(-10.26 35.2 50.22)" fill="#FC909F"/></g>`,
  'laughing': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M62.8 25.18a34 34 0 0 0 1.12-11.85 2.98 2.98 0 0 0-4.08-2.51c-4.22 1.66-18.21 6.96-28.08 8.32-10.82 1.49-27.2-.32-31.95-.9a2.98 2.98 0 0 0-3.32 3.43 34 34 0 0 0 66.32 3.5Z" fill="${escape.xml(`#${colors.mouth}`)}" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/><mask id="mouthLaughing-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-2" y="12" width="65" height="37"><path d="M61.8 12.2a32 32 0 0 1-63.52 7.85l63.51-7.86Z" fill="#171921"/></mask><g mask="url(#mouthLaughing-a)"><circle cx="34.52" cy="52.31" r="21.5" transform="rotate(-7.05 34.52 52.31)" fill="#FC909F"/></g>`,
  'nervous': (components: ComponentPickCollection, colors: ColorPickCollection) => `<rect x="-6.75" y="17.47" width="70" height="24" rx="4" transform="rotate(-4 -6.75 17.47)" fill="${escape.xml(`#${colors.mouth}`)}"/><path d="m56.82 13.03-57.32 4 1.84 7a6 6 0 0 0 6.23 4.47 6 6 0 0 0-5.54 5.28l-.85 7.2 57.32-4.01-1.84-7a6 6 0 0 0-6.23-4.47 6 6 0 0 0 5.54-5.28l.85-7.2Z" fill="#fff"/><path d="M66.42 31.7 65.4 17.13a6.06 6.06 0 0 0-7.32-5.48c-6.94 1.49-20.22 4.13-29.82 4.8-9.6.68-23.1-.1-30.2-.6a6.06 6.06 0 0 0-6.48 6.45l1.02 14.57a6.06 6.06 0 0 0 7.32 5.48c6.94-1.49 20.22-4.13 29.82-4.8 9.6-.68 23.1.1 30.2.6a6.06 6.06 0 0 0 6.48-6.45Z" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
  'smile': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M-.5 17.5c2.5 17 31 25 57 5.5" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
  'sad': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M13 46c1.72-7.96 8.07-24.77 19.77-28.35 11.7-3.58 17.7 8.46 19.23 14.92" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
  'pucker': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M26 16.7c4.17-2.34 21-5.3 21 1.5 0 8.5-11.5 8-11.5 8s13.04-3.16 10.5 6c-2.5 9-9.5 5.5-11.5 4.5" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
  'frown': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M-5 41c3.21-7.96 15.1-24.77 37-28.35 21.9-3.58 33.13 8.46 36 14.92" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
  'smirk': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M10 24.16c4.94 6.45 12.43 13.6 23.98 11.96 11.55-1.62 16.68-9.6 15.17-16.04" stroke="${escape.xml(`#${colors.mouth}`)}" stroke-width="4"/>`,
}
