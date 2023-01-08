/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/oa0iScDLrh1tVFzSud2Dwc
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const body: ComponentGroup = {
  'squared': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M16 5v3a5 5 0 0 0 10 0V5l6.65 2.05a9 9 0 0 1 6.35 8.6V20H3v-4.35a9 9 0 0 1 6.35-8.6L16 5Z" fill="${escape.xml(`#${colors.clothing}`)}"/>`,
  'rounded': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M16 7v.47a5 5 0 1 0 10 0V7c7.06 1.52 12.93 6.74 16 13H0C3.07 13.74 8.94 8.52 16 7Z" fill="${escape.xml(`#${colors.clothing}`)}"/>`,
  'small': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M32 20H10v-8a11 11 0 0 1 6-9.8V4a5 5 0 0 0 10 0V2.2a11 11 0 0 1 6 9.8v8Z" fill="${escape.xml(`#${colors.clothing}`)}"/><mask id="bodySmall-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="2" width="22" height="18"><path d="M32 20H10v-8a11 11 0 0 1 6-9.8V4a5 5 0 0 0 10 0V2.2a11 11 0 0 1 6 9.8v8Z" fill="#fff"/></mask><g mask="url(#bodySmall-a)"><path opacity=".14" d="M20.62 8.25 22 8l1.2.5L10 15l10.62-6.75Z" fill="#000"/><path d="M21 1h11v47H10V15l13.34-6.58L21 1Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".26"/></g>`,
  'checkered': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M16 5v3a5 5 0 0 0 10 0V5l6.65 2.05a9 9 0 0 1 6.35 8.6V20H3v-4.35a9 9 0 0 1 6.35-8.6L16 5Z" fill="${escape.xml(`#${colors.clothing}`)}"/><mask id="bodyCheckered-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="5" width="36" height="15"><path d="M16 5v3a5 5 0 0 0 10 0V5l6.65 2.05a9 9 0 0 1 6.35 8.6V20H3v-4.35a9 9 0 0 1 6.35-8.6L16 5Z" fill="#fff"/></mask><g mask="url(#bodyCheckered-a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 20h4V6.54l-1.65.5A9 9 0 0 0 7 8.17V20ZM32.65 7.05 31 6.54V20h4V8.16a9 9 0 0 0-2.35-1.11ZM23 20h4v-8.4a7.02 7.02 0 0 1-4 3.11v5.3Zm-4 0h-4v-8.4a7.02 7.02 0 0 0 4 3.11v5.3Z" fill="#000" style="mix-blend-mode:overlay" opacity=".4"/></g><path d="M3.4 13a9.01 9.01 0 0 1 2.53-4h8.14a6.98 6.98 0 0 0 2.03 4H3.4ZM39 17v3H3v-3h36ZM36.07 9a9.01 9.01 0 0 1 2.53 4H25.9a6.98 6.98 0 0 0 2.03-4h8.14Z" style="mix-blend-mode:lighten" opacity=".18" fill="#fff"/><mask id="bodyCheckered-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="9" width="36" height="11"><path d="M3.4 13a9.01 9.01 0 0 1 2.53-4h8.14a6.98 6.98 0 0 0 2.03 4H3.4ZM39 17v3H3v-3h36ZM36.07 9a9.01 9.01 0 0 1 2.53 4H25.9a6.98 6.98 0 0 0 2.03-4h8.14Z" style="mix-blend-mode:lighten" fill="#fff"/></mask>`,
}
