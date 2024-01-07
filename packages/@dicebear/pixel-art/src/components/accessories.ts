/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/WTcivb1XPf5ODtyv7ZNnU9
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const accessories: ComponentGroup = {
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M2 7h1v1H2zM13 7h1v1h-1z" fill="${escape.xml(
      `${colors.accessories}`
    )}"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M13 7h1v2h-1zM2 7h1v2H2z" fill="${escape.xml(
      `${colors.accessories}`
    )}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path fill="${escape.xml(
      `${colors.accessories}`
    )}" d="M13 7h1v2h-1zM2 7h1v2H2z"/><path fill="#fff" fill-opacity=".5" d="M2 7h1v1H2zM13 7h1v1h-1z"/>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M13 7h2v2h-2zM1 7h2v2H1z" fill="${escape.xml(
      `${colors.accessories}`
    )}"/>`,
};
