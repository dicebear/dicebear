/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/np7zgQo9412LDvi1mA1UmK
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const row5: ComponentGroup = {
  'xooox': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M1 4H0v1h1V4ZM5 4H4v1h1V4Z" fill="${escape.xml(`${colors.row}`)}"/>`,
  'xxoxx': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M2 4H0v1h2V4ZM5 4H3v1h2V4Z" fill="${escape.xml(`${colors.row}`)}"/>`,
  'xoxox': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M0 4h1v1H0V4ZM4 4h1v1H4V4ZM3 4H2v1h1V4Z" fill="${escape.xml(`${colors.row}`)}"/>`,
  'oxxxo': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill="${escape.xml(`${colors.row}`)}" d="M1 4h3v1H1z"/>`,
  'xxxxx': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill="${escape.xml(`${colors.row}`)}" d="M0 4h5v1H0z"/>`,
  'oxoxo': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M2 4H1v1h1V4ZM4 4H3v1h1V4Z" fill="${escape.xml(`${colors.row}`)}"/>`,
  'ooxoo': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill="${escape.xml(`${colors.row}`)}" d="M2 4h1v1H2z"/>`,
}
