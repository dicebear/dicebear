import { escape } from '@dicebear/core';
import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const eyes: ComponentGroup = {
  bulging: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<circle cx="28" cy="24" r="18" fill="#000" fill-opacity=".2"/><circle cx="74" cy="24" r="18" fill="#000" fill-opacity=".2"/><circle cx="28" cy="24" r="15" fill="#F1EEDA"/><circle cx="74" cy="24" r="15" fill="#F1EEDA"/><rect x="26" y="15" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/><rect x="74" y="15" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>`,
  dizzy: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="m25 27.2 5.5 5.5c.5.4 1.2.4 1.6 0l1.6-1.6c.4-.5.4-1.2 0-1.6L28.2 24l5.5-5.5c.4-.5.4-1.2 0-1.6l-1.6-1.6c-.5-.4-1.2-.4-1.6 0L25 20.8l-5.5-5.5c-.5-.4-1.2-.4-1.6 0l-1.6 1.6c-.4.4-.4 1.1 0 1.6l5.5 5.5-5.5 5.5c-.4.5-.4 1.2 0 1.6l1.6 1.6c.5.4 1.2.4 1.6 0l5.5-5.5ZM79 27.2l5.5 5.5c.5.4 1.2.4 1.6 0l1.6-1.6c.4-.5.4-1.2 0-1.6L82.2 24l5.5-5.5c.4-.5.4-1.2 0-1.6l-1.6-1.6c-.5-.4-1.2-.4-1.6 0L79 20.8l-5.5-5.5c-.5-.4-1.2-.4-1.6 0l-1.6 1.6c-.4.4-.4 1.1 0 1.6l5.5 5.5-5.5 5.5c-.4.5-.4 1.2 0 1.6l1.6 1.6c.5.4 1.2.4 1.6 0l5.5-5.5Z" fill="#000" fill-opacity=".8"/>`,
  eva: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M53 0c34.75 0 49 17.47 49 31 0 13.53-19.59 17-49 17-29.05 0-51-3.47-51-17S17.11 0 53 0Z" fill="#000" fill-opacity=".8"/><path d="M28.82 34.65c-6.53-1.35-11.24-6.34-10.52-11.14.72-4.79 6.6-7.58 13.12-6.23 6.53 1.36 11.24 6.35 10.52 11.15-.72 4.8-6.6 7.59-13.12 6.23ZM75.42 34.65c-6.52 1.36-12.4-1.43-13.12-6.23-.72-4.8 4-9.8 10.52-11.15 6.52-1.35 12.4 1.44 13.12 6.24.72 4.81-4 9.8-10.52 11.15Z" fill="#25A6F5"/></g>`,
  frame1: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<rect y="4" width="104" height="42" rx="4" fill="#000" fill-opacity=".8"/><rect x="28" y="25" width="10" height="11" rx="2" fill="#8BDDFF"/><rect x="66" y="25" width="10" height="11" rx="2" fill="#8BDDFF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21 4h8L12 46H4L21 4Z" fill="#fff" fill-opacity=".4"/>`,
  frame2: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<rect x="8" y="10" width="88" height="36" rx="4" fill="#000" fill-opacity=".8"/><rect x="28" y="21" width="10" height="17" rx="2" fill="#5EF2B8"/><rect x="66" y="21" width="10" height="17" rx="2" fill="#5EF2B8"/><path fill-rule="evenodd" clip-rule="evenodd" d="M83 10h5L76 46h-5l12-36Z" fill="#fff" fill-opacity=".4"/>`,
  glow: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g fill="#fff"><circle cx="21" cy="30" r="15" fill-opacity=".1"/><circle cx="83" cy="30" r="15" fill-opacity=".1"/><circle cx="21" cy="30" r="12" fill-opacity=".1"/><circle cx="83" cy="30" r="12" fill-opacity=".1"/><circle cx="21" cy="30" r="6" fill-opacity=".8"/><circle cx="83" cy="30" r="6" fill-opacity=".8"/><circle cx="21" cy="30" r="3" fill-opacity=".8"/><circle cx="83" cy="30" r="3" fill-opacity=".8"/></g>`,
  happy: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="m18 19 12-2M20 31c0-3.31 2.9-6 7-6 3.1 0 6 2.69 6 6M86 20l-12-3M84 31c0-3.31-2.9-6-6-6-4.1 0-7 2.69-7 6" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  hearts: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M29.27 9.68c-2.55.13-4.96 2.24-6.25 4.15-1.48-1.76-4.1-3.6-6.65-3.47-5.48.28-8.85 3.8-8.63 8.1.3 5.72 4.88 8.89 9.7 12.24 1.71 1.15 5 4.15 5.42 4.82.42.67 2.14.6 2.58-.13a37.8 37.8 0 0 1 4.9-5.36c4.43-3.84 8.66-7.47 8.36-13.2-.23-4.3-3.95-7.44-9.43-7.15ZM87.63 10.36c-2.55-.14-5.17 1.7-6.65 3.47-1.3-1.9-3.7-4.02-6.25-4.15-5.48-.29-9.2 2.86-9.43 7.16-.3 5.72 3.93 9.35 8.36 13.19 1.6 1.32 4.55 4.64 4.9 5.36.35.7 2.06.82 2.58.13.51-.7 3.7-3.67 5.42-4.82 4.81-3.35 9.4-6.52 9.7-12.24.22-4.3-3.15-7.82-8.63-8.1Z" fill="#FF5353" fill-opacity=".8"/>`,
  robocop: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<rect x="7" y="16" width="91" height="16" rx="4" fill="#000" fill-opacity=".8"/><mask id="eyesRobocop-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="7" y="16" width="91" height="16"><rect x="7" y="16" width="91" height="16" rx="4" fill="#fff"/></mask><g mask="url(#eyesRobocop-a)" fill-rule="evenodd" clip-rule="evenodd" fill="#fff" fill-opacity=".8"><path d="M76 7h18L82 37H64L76 7ZM52 7h9L49 37h-9L52 7Z"/></g>`,
  round: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g fill="#fff"><circle cx="24" cy="30" r="6"/><circle cx="80" cy="30" r="6"/></g>`,
  roundFrame01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<rect y="12" width="104" height="32" rx="16" fill="#000" fill-opacity=".8"/><rect x="24" y="22" width="10" height="12" rx="2" fill="#F4F4F4"/><rect x="70" y="22" width="10" height="12" rx="2" fill="#F4F4F4"/>`,
  roundFrame02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<rect y="11" width="104" height="34" rx="17" fill="#000" fill-opacity=".8"/><circle cx="29" cy="28" r="13" fill="#F1EEDA"/><circle cx="75" cy="28" r="13" fill="#F1EEDA"/><rect x="24" y="23" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/><rect x="70" y="23" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>`,
  sensor: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M28 44a20 20 0 0 0 19.9-18h41.52a5 5 0 1 0 0-4H47.9A20 20 0 1 0 28 44Z" fill="#000" fill-opacity=".2"/><circle cx="94" cy="24" r="2" fill="#fff"/><circle cx="28" cy="24" r="16" fill="#000" fill-opacity=".6"/><circle cx="34" cy="16" r="3" fill="#fff"/>`,
  shade01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 10a8 8 0 0 1 8-8h88a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H82.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2.47 2.12-5.15 4.4-8.24 4.4H38.67c-3.14 0-5.94-2.12-8.62-4.16-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0 0 21.02 36H8a8 8 0 0 1-8-8V10Z" fill="#000" fill-opacity=".8"/><mask id="eyesShade01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="2" width="104" height="42"><path d="M0 10a8 8 0 0 1 8-8h88a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H82.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2.47 2.12-5.15 4.4-8.24 4.4H38.67c-3.14 0-5.94-2.12-8.62-4.16-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0 0 21.02 36H8a8 8 0 0 1-8-8V10Z" fill="#000" fill-opacity=".8"/></mask><g mask="url(#eyesShade01-a)"><path d="M12 19a5 5 0 0 1 5-5h70a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5H74.98c-3.27.17-5.48 1.14-6.98 2.35l-1.48 1.24c-2 1.72-4.14 3.54-6.52 4.18V34H46.67c-3.14 0-5.94-2.13-8.62-4.17-.95-.72-1.89-1.44-2.82-2.04A12.38 12.38 0 0 0 29.02 26H17a5 5 0 0 1-5-5v-2Z" fill="#FF3D3D"/><path d="M12 44 32-2h-4L8 44h4ZM50-2H39L19 44h11L50-2Z" fill="#fff" fill-opacity=".2"/></g>`,
};
