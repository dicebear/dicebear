import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const row5: ComponentGroup = {
  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M1 4H0v1h1V4ZM5 4H4v1h1V4Z" fill="${escape.xml(
      colors.row.value
    )}"/>`,
  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 4H0v1h2V4ZM5 4H3v1h2V4Z" fill="${escape.xml(
      colors.row.value
    )}"/>`,
  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 4h1v1H0V4ZM4 4h1v1H4V4ZM3 4H2v1h1V4Z" fill="${escape.xml(
      colors.row.value
    )}"/>`,
  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(colors.row.value)}" d="M1 4h3v1H1z"/>`,
  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(colors.row.value)}" d="M0 4h5v1H0z"/>`,
  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 4H1v1h1V4ZM4 4H3v1h1V4Z" fill="${escape.xml(
      colors.row.value
    )}"/>`,
  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${escape.xml(colors.row.value)}" d="M2 4h1v1H2z"/>`,
};
