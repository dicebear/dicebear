import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const hair: ComponentGroup = {
  balndess: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g fill="${escape.xml(
      colors.hair.value
    )}"><rect x="14" y="26" width="9" height="2" rx="1"/><rect x="14" y="33" width="7" height="2" rx="1"/><rect x="12" y="29" width="13" height="3" rx="1.5"/></g>`,
  slaughter: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M24 25c0 .53-.1 1.04-.3 1.5A3.99 3.99 0 0 1 20 32a4 4 0 0 1-8 0c0-1.05.07-2.78.37-4.32a4 4 0 0 1 4.8-5.5A3.99 3.99 0 0 1 24 25ZM45.85 33.9a4 4 0 0 0 2.78-5.4 3.99 3.99 0 0 0-3.13-5.46c.6 3.14.48 6.61.38 9.78 0 .36-.02.72-.03 1.07Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  ponyTail: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M0 10c8-8 13 3 13 3l-2 8s-2 2.5 0 10-2.5 11.5-2.5 11.5S5 45 2 43s-3.4-3.92-3-7.5c.5-4.5 2-3 2-7.5s-9-10-1-18Z" fill="${escape.xml(
      colors.hair.value
    )}"/><path d="m13.03 13.18 5.5 2.38-3.56 8.26-5.51-2.38S8.5 19.5 10 16.5c1.5-3 3.03-3.32 3.03-3.32Z" fill="#FF6C98"/><path d="m18 41-1.32-8.82A5 5 0 0 0 18 42v8.3c-1.55-1.37-2.93-3-4.08-4.83-1.7-2.7-2.9-5.8-3.48-9.1-.6-3.28-.58-6.68.04-9.96a25.57 25.57 0 0 1 3.55-9.05 21.32 21.32 0 0 1 6.43-6.5A17.85 17.85 0 0 1 31 8c2.5 0 4.97.45 7.27 1.33 2.3.88 4.4 2.17 6.16 3.8a17.48 17.48 0 0 1 4.12 5.67c.75 1.66 1.21 3.42 1.38 5.2H50v4.29s-.33.15-1 .36v8.5s0 1.4-1.5 2.45c-.52.36-1.22.64-1.9.85.19-1.45.29-2.91.29-4.35 0-1.04.03-2.14.07-3.29.04-1.11.07-2.27.08-3.44-1.85.34-4.37.63-7.58.63C30.62 30 26 28.29 26 28.29v-1A26.13 26.13 0 0 0 24 31c-.75 1.75-.75 3.54-.75 5.05 0 1.5 0 2.73-.75 3.34-1.5 1.2-4.5 1.6-4.5 1.6Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  long: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill-rule="evenodd" clip-rule="evenodd" d="M48 25a18 18 0 0 0-36-.5V65h11V34.6a65.12 65.12 0 0 0 12.2-3.76 53.45 53.45 0 0 0 10.68-5.64c.24 2.53.15 5.16.08 7.61-.04 1.15-.08 2.25-.08 3.29 0 .4 0 .82-.02 1.23.23-.07.45-.15.64-.24 1.5-.69 1.5-1.6 1.5-1.6V25Zm-33 8a4.98 4.98 0 0 0 0 8v-8Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  curly: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g fill="${escape.xml(
      colors.hair.value
    )}"><path d="M45.97 32.48a4 4 0 0 0 1.78-4.88 4 4 0 0 0-2.97-7.41c1.42 3.67 1.31 8.22 1.19 12.3Z"/><path d="M36.3 22.76a4.98 4.98 0 0 1-6.36.2 6.98 6.98 0 0 1-6.99 1.74c-.26.28-.56.53-.89.73a3.98 3.98 0 0 1-1.35 6.19c.2.24.3.55.3.88a1.5 1.5 0 0 1-1.53 1.5 4 4 0 0 1-7.3-3.17 3.99 3.99 0 0 1 0-5.66 4 4 0 0 1 .74-3.71 7 7 0 0 1 4.1-10.17V11a4 4 0 0 1 5.94-3.5 7 7 0 0 1 9.8-2.42 6.48 6.48 0 0 1 10.78 1.95 4 4 0 0 1 3.43 4.58 7.33 7.33 0 0 1 3.05 5.9c0 4.14-3.58 7.5-8 7.5a8.25 8.25 0 0 1-5.7-2.24Z"/></g>`,
  stylish: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M20.67 28.22v6.02c0 .76-.67 1.76-1.17 2.26-.5.5-2 1.5-2.85 1.5-.85 0-3.54-.45-4.83-2.26-1.28-1.8-.89-11.32 0-13.54.9-2.21 4.19-6.88 8.85-10.45a26.26 26.26 0 0 1 12.88-5.34C58.48 3.4 49.22 20.99 46 25.5c-5.5-2-9.5-2.5-16.72-1.53-7.21.99-8.01 1.99-8.6 4.24Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  elvis: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M22 28c-.63 3 1 6.98 1 7.74 0 .77-3.93 3.03-5 3.76-1.07.73-1.5-7-1.5-7-3 0-3.5 5.5-3.5 5.5s-2.25-.74-3-4.5c-.51-2.54.3-8.09.5-9.5.5-3.5 1-11.5 7.5-15.5s23-4 27-3C54.9 7.97 56.22 21.5 53 26c-5 5.5-19-1-23.5-1s-6.87 0-7.5 3Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  classic02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M28.12 27.47C35.92 28.6 49.6 30.6 51 18 52 9 38.5-1.5 24 8c-9.1 1.35-11.39 8.28-11.9 14.26a3.99 3.99 0 0 0-.8 4.24 3.99 3.99 0 0 0 .87 4.33A4 4 0 1 0 20 32a4 4 0 0 0 3.87-5H24c.95 0 2.4.21 4.12.47Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
  classic01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M29.7 26.2c5.6 1.87 13.39 4.45 21.53-3.7 4-4-14-21-28.5-11.5-11.33 1.68-10.68 8.47-10.18 13.71.1 1 .18 1.95.18 2.8 0 .52.07.92.2 1.2-.16 1.24-.2 2.48-.2 3.3a4 4 0 1 0 8 0A4 4 0 0 0 24.61 27h.12a4 4 0 0 0 3.06-1.41c.6.18 1.24.4 1.9.61Z" fill="${escape.xml(
      colors.hair.value
    )}"/>`,
};
