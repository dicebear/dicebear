import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const clothing: ComponentGroup = {
  variant23: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M4 13h1v3H4zM11 13h1v3h-1z"/>`,
  variant22: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M6 13H4v3h2v-3ZM12 13h-2v3h2v-3Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M5 13h1v3H5zM10 13h1v3h-1z"/>`,
  variant21: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H4v3h3v-1H6v-1H5v-1ZM12 13h-1v1h-1v1H9v1h3v-3Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M4 13h1v1H4zM5 14h1v1H5zM6 15h1v1H6zM9 15h1v1H9zM10 14h1v1h-1zM11 14h1v1h-1zM11 13h1v1h-1zM10 15h1v1h-1zM5 15h1v1H5zM4 14h1v1H4z"/>`,
  variant20: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path fill="${escape.xml(
      colors.clothing.value
    )}" d="M4 14h8v2H4z"/><path fill="none" d="M4 14h1v2H4zM11 14h1v2h-1z"/>`,
  variant19: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 13h1v1h6v-1h1v3H4v-3Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M9 15h2v1H9z"/>`,
  variant18: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 13h2v1h1v1h2v-1h1v-1h2v3H4v-3Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M10 14h1v1h-1zM11 13h1v1h-1zM9 15h1v1H9zM9 14h1v1H9zM10 13h1v1h-1zM8 15h1v1H8zM6 14H5v1h1zM5 13H4v1h1zM7 15H6v1h1zM7 14H6v1h1zM6 13H5v1h1zM8 15H7v1h1z"/>`,
  variant17: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 13h2v1h1v1h2v-1h1v-1h2v1h1v2H3v-2h1v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant16: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H3v1H2v2h5v-1H6v-1H5v-1ZM13 13h-2v1h-1v1H9v1h5v-2h-1v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M11 13h1v1h-1zM10 14h1v1h-1zM9 15h1v1H9zM6 15h1v1H6zM5 14h1v1H5zM4 13h1v1H4z"/>`,
  variant15: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M6 14H4v1H3v1h4v-1H6v-1ZM12 15h1v1H9v-1h1v-1h2v1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant14: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1h-1v1H6v-1H5v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant13: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1H5v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M2 14h1v2H2zM6 14h1v2H6zM8 14h1v2H8zM10 14h1v2h-1zM4 13h1v3H4zM12 13h1v3h-1z"/>`,
  variant12: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M7 12h2v1h4v1h1v2H2v-2h1v-1h4v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M7 12h2v1H7z"/>`,
  variant11: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h1v1h2v-1h1v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant10: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 13h1v1h6v-1h1v1h1v2H3v-2h1v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M9 15h2v1H9z"/>`,
  variant09: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 13h1v2h6v-2h1v2h1v1H3v-1h1v-2Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M4 13h1v2H4zM11 13h1v2h-1z"/>`,
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v2h4v-2Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H4v3h3v-1H6v-1H5v-1ZM12 13h-1v1h-1v1H9v1h3v-3Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M3 13h1v1H3zM2 14h1v1H2zM3 15h1v1H3zM4 14h1v1H4zM5 13h1v1H5zM5 15h1v1H5zM6 14h1v1H6zM7 15h1v1H7zM8 14h1v1H8zM9 15h1v1H9zM10 14h1v1h-1zM11 15h1v1h-1zM11 13h1v1h-1zM12 14h1v1h-1zM13 15h1v1h-1z"/>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1h-1v1H6v-1H5v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1H5v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v2h4v-2Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M5 14h1v1H5zM4 15h1v1H4zM7 15h1v1H7zM3 13h1v1H3zM2 14h1v1H2zM12 13h1v1h-1zM11 14h1v1h-1zM10 15h1v1h-1zM13 15h1v1h-1z"/>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${escape.xml(
      colors.clothing.value
    )}"/><path fill="none" d="M11 14h1v2h-1zM4 14h1v2H4z"/>`,
};
