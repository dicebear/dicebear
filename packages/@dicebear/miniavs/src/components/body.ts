import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const body: ComponentGroup = {
  tShirt: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<rect x="7" y="60" width="40" height="23" rx="9" fill="${escape.xml(
      colors.body.value
    )}"/>`,
  golf: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<rect x="7" y="60" width="40" height="23" rx="9" fill="${escape.xml(
      colors.body.value
    )}"/><path d="M17 58h19v3s-5 1-9.5 1-9.5-1-9.5-1v-3Z" fill="${escape.xml(
      colors.body.value
    )}"/><path d="M17 58h19v2s-3 1.5-9.5 1.5S17 60 17 60v-2Z" fill="#000" fill-opacity=".2"/><path d="M16.5 59c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2s-5 1-10 1-10-1-10-1Z" fill="${escape.xml(
      colors.body.value
    )}"/>`,
};
