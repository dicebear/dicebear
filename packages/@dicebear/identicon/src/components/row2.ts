/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/np7zgQo9412LDvi1mA1UmK
 */

import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const row2: ComponentGroup = {
  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M1 1H0v1h1V1ZM5 1H4v1h1V1Z" fill="${escape.xml(
      `${colors.row}`
    )}"/>`,
  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 1H0v1h2V1ZM5 1H3v1h2V1Z" fill="${escape.xml(
      `${colors.row}`
    )}"/>`,
  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 1h1v1H0V1ZM4 1h1v1H4V1ZM3 1H2v1h1V1Z" fill="${escape.xml(
      `${colors.row}`
    )}"/>`,
  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(`${colors.row}`)}" d="M1 1h3v1H1z"/>`,
  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(`${colors.row}`)}" d="M0 1h5v1H0z"/>`,
  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 1H1v1h1V1ZM4 1H3v1h1V1Z" fill="${escape.xml(
      `${colors.row}`
    )}"/>`,
  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(`${colors.row}`)}" d="M2 1h1v1H2z"/>`,
};
