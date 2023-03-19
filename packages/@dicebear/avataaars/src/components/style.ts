/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/HBLdITkkTnLs4M09BmCe4h
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const style: ComponentGroup = {
  'circle': (components: ComponentPickCollection, colors: ColorPickCollection) => `<circle cx="132" cy="160" r="120" fill="${escape.xml(`${colors.background}`)}"/><mask id="styleCircle-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="264" height="280"><path d="M264 0H0v160h12c0 66.27 53.73 120 120 120 66.27 0 120-53.73 120-120h12V0Z" fill="#fff"/></mask><g mask="url(#styleCircle-a)">${components.base?.value(components, colors) ?? ''}</g>`,
  'default': (components: ComponentPickCollection, colors: ColorPickCollection) => `${components.base?.value(components, colors) ?? ''}`,
}
