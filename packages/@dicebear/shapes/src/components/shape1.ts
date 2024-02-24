/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/bX8ZT8jK2fo5Uy8G6j2Qic
 */

import { escape } from '@dicebear/core';
import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../types.js';

export const shape1: ComponentGroup = {
  'rectangle': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M90 10H10v80h80V10ZM0 0v100h100V0H0Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'rectangleFilled': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M0 0h100v100H0V0Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'ellipseFilled': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="M100 50A50 50 0 1 1 0 50a50 50 0 0 1 100 0Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'ellipse': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M50 90a40 40 0 1 0 0-80 40 40 0 0 0 0 80Zm0 10A50 50 0 1 0 50 0a50 50 0 0 0 0 100Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'polygonFilled': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path d="m50 7 50 86.6H0L50 7Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'polygon': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M50 7 0 93.6h100L50 7Zm0 20L17.3 83.6h65.4L50 27Z" fill="${escape.xml(`${colors.shape1}`)}"/>`,
  'line': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill="${escape.xml(`${colors.shape1}`)}" d="M45-150h10v400H45z"/>`,
}
