import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const glasses: ComponentGroup = {
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path opacity=".2" d="M5 7h3v3H5V7Zm7 0h3v3h-3V7Z" fill="#fff"/><path opacity=".2" d="M7 7h1v1H7V7Zm7 0h1v1h-1V7Z" fill="#fff"/><path d="M12 10V7h3v3h-3Zm-1-4v1H9V6H4v1H3v1h1v3h5V8h2v3h5V8h1V7h-1V6h-5Zm-6 4V7h3v3H5Z" fill="${colors.glasses.value}"/><path d="M3 7h1v1H3V7Zm6 0h2v1H9V7Zm7 0h1v1h-1V7Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path opacity=".2" d="M5 7h3v2H5V7Zm7 0h3v2h-3V7Z" fill="#fff"/><path opacity=".2" d="M7 7h1v1H7V7Zm7 0h1v1h-1V7Z" fill="#fff"/><path d="M5 7v2h3V7H5ZM4 6v1H3v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7h-1V6h-5v1H9V6H4Zm8 1v2h3V7h-3Z" fill="${colors.glasses.value}"/><path d="M3 7h1v1H3V7Zm6 0h2v1H9V7Zm7 0h1v1h-1V7Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path opacity=".2" d="M5 8h3v1H5V8Zm7 0h3v1h-3V8Z" fill="#fff"/><path opacity=".2" d="M7 8h1v1H7V8Zm7 0h1v1h-1V8Z" fill="#fff"/><path d="M5 8v1h3V8H5ZM3 7v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7H3Zm9 1v1h3V8h-3Z" fill="${colors.glasses.value}"/><path d="M3 7v1h1V7H3Zm6 0v1h2V7H9Zm7 0v1h1V7h-1Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path opacity=".2" d="M5 7h3v2H5V7Zm7 0h3v2h-3V7Z" fill="#fff"/><path opacity=".2" d="M7 7h1v1H7V7Zm7 0h1v1h-1V7Z" fill="#fff"/><path d="M12 7v2h3V7h-3ZM8 6H5v1H3v1h1v1h1v1h3V9h1V8h2v1h1v1h3V9h1V8h1V7h-2V6h-3v1H8V6ZM5 7v2h3V7H5Z" fill="${colors.glasses.value}"/><path d="M3 7h1v1H3V7Zm6 0h2v1H9V7Zm7 0h1v1h-1V7Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M4 8H3V7h1V6h5v1h2V6h5v1h1v1h-1v2h-5V8H9v2H4V8Zm1 0V7h3v2H5V8Zm7-1v2h3V7h-3Z" fill="${colors.glasses.value}"/><path opacity=".2" d="M5 7h3v2H5V7Zm7 0h3v2h-3V7Z" fill="#fff"/><path opacity=".2" d="M14 7h1v1h-1V7ZM7 7h1v1H7V7Z" fill="#fff"/><path d="M3 8V7h1v1H3Zm6-1v1h2V7H9Zm7 0v1h1V7h-1Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M4 8H3V7h14v1h-1v2h-5V8H9v2H4V8Zm1 0h3v1H5V8Zm7 0h3v1h-3V8Z" fill="${colors.glasses.value}"/><path opacity=".2" d="M7 8v1h1V8H7Zm7 0v1h1V8h-1Z" fill="#fff"/><path opacity=".2" d="M5 8h3v1H5V8Zm7 0h3v1h-3V8Z" fill="#fff"/><path d="M3 7v1h1V7H3Zm13 0v1h1V7h-1ZM9 7v1h2V7H9Z" fill="#fff" fill-opacity=".2"/></g>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 8V7h1V6h2v1h1V6h2v1h2V6h2v1h1V6h2v1h1v1h-1v1h-1v1h-1v1h-1v-1h-1V9h-1V8H9v1H8v1H7v1H6v-1H5V9H4V8H3Z" fill="${colors.glasses.value}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 7v1h1V7h1V6H4v1H3Zm5-1v1h1v1h2V7h1V6h-1v1H9V6H8Zm7 0v1h1v1h1V7h-1V6h-1Z" fill="#fff" fill-opacity=".2"/>`,
};
