import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const face: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M73.7 93.5a45.6 45.6 0 0 1 7.2-17c3-5 9-9.5 16.4-13a90.1 90.1 0 0 1 26.4-7.7c19-2.5 40.2.5 53.5 14l.6.4c7.8 7.5 9.5 18.5 9.2 30.3v1.3c1.5.3 3.3 1.3 4.8 3.2 1.8 2.4 2.8 6.3 1.8 12a21.4 21.4 0 0 1-2.9 8.1l-.8 1.5c-.8 1.4-1.6 2.9-2.7 3.8a4 4 0 0 1-3 .9l-.5 6.4c-2.2 37-4.7 59.8-22.1 79.2-16.9 18.7-43.6 13.3-57 0-10.7-10.7-28.5-33-32-83.4-1.9.3-3.7-1-5-3-1.6-2.4-3-6.1-4.1-11.8-1-5.5-.3-9.4 1.5-12a8.2 8.2 0 0 1 6.8-3.4h.5c.3-3.7.8-7 1.4-9.8Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M186.4 102.2c2.3 0 8.3 2.7 6.4 13.8-.9 4.9-2 6-3.7 9.2-1.5 2.8-2.7 4.9-5.5 3.6M70.4 103.8c-3.8 0-9 3.2-7 13.8 2.2 11.4 5.6 14.4 7.9 13.7"/><path d="M82.2 74.4C75 84.8 70.4 94 72.7 131c3.2 51.9 21.4 74.5 32.2 85.2 13.1 13 39.3 18 55.7 0 17.3-19.2 19.8-41.8 22-79.2 1.5-24.9 9.4-52.8-5.4-67"/></g><g transform="translate(117 131)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(63 147)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(100 194)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(0 -34)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(72 160)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(72 89)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="m176 91.2.3.4c.3.1.7.4.9.7a81 81 0 0 1 8 27.7c4.7-1.6 11.8 2 11.8 10 0 4-.3 6.7-1 9-.6 2.3-1.6 4-3 5.8a9.4 9.4 0 0 1-7.7 3.3 71.7 71.7 0 0 1-26.1 49.2 51.6 51.6 0 0 1-37.2 11.4 43.6 43.6 0 0 1-30.2-18 114.1 114.1 0 0 1-19.5-42.3c-1.5.2-3.8 0-6-1.2-3-1.5-5.7-4.7-6.8-10.6-1-5.3-.4-10 1.7-13a8 8 0 0 1 4.3-3.1c1.5-.5 3.2-.5 5 0A42.2 42.2 0 0 1 96 84.3a90.3 90.3 0 0 1 26.3-7.5c19.1-2.5 40.5.5 53.7 14.4Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M81.3 95c-17 17-15 61 11 96.5 15 20.5 42.2 25.1 66.7 6.5 34.5-26.2 30.5-83 18-106"/><path d="M186.4 121.4c3.6-1.9 10.7.8 10.7 8.7 0 7.8-1.1 10.8-3.7 14.2-2 2.6-5.6 3.2-8 2.7M69.7 121.9c-7.7-2.4-12.2 4-10.2 14.6 2.1 11.4 10.2 11.3 12.5 10.8"/></g><g transform="translate(112 123)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(60 128)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(95 180)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-1 -13)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(67 152)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(71 102)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M174.8 105c11.3 21.8 19.2 65 13.4 72.3C175 194 109 199 86 184.2c-15.5-10-16.5-61.2-8.3-75M183 121.7c3-1 8.5-3.8 9.8 1.8 1.3 5.6 1.3 9 0 15-.7 3-2.3 4-4.3 4"/><path d="M72.2 124.3c-7.6-2.4-12.1 2-9.4 11.4 2.6 9 7 10.8 9.4 10.3"/></g><g transform="translate(112 122)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(63 112)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(98 168)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-3 -1)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(68 149)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(71 103)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M73.3 106.5c2-5.5 4-9.8 5.4-12.2-.1-.4 0-.8.1-1.1 3-4.9 9-9.3 16.4-12.9a90.7 90.7 0 0 1 26.3-7.5c19.2-2.5 40.7.5 53.9 14.4.2.3.4.6.4 1 1 1.1 2.2 3.2 3.6 6a109 109 0 0 1 4.4 10.2c1.4-.5 3-.7 4.6-.5a7 7 0 0 1 5.4 3.3c2 3.5 2.9 10 1.6 15.8a6.7 6.7 0 0 1-2.6 4.2 6 6 0 0 1-2.3 1c.5 2.8 1 5.6 1.3 8.5 2.8 23.3-1.3 49.6-26 62.6-23.6 12.4-47 16-65.6 12.3-18.7-3.8-32.6-15-36.7-32.5-3.2-13.5-1.3-31 2.2-46.7-1.5-.3-3-1.4-3.9-3-1.3-2.1-2-5.2-1.7-9.2.5-6.2 2.1-10.6 4.8-12.8a7 7 0 0 1 4.6-1.8 9 9 0 0 1 3.8.9Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M79 93.7c-6 10-22.2 57.6-15.5 86.4 8.1 34.4 54.6 44.9 102.1 19.7C214.3 174 182.2 95.5 175.3 88"/><path d="M184.3 105.4c2.6-1.1 7.4-1.3 9.3 2 1.8 3.2 2.7 9.3 1.4 15.1-.7 3.3-3 4.3-5 4.3M72.5 107.8c-5.9-3.5-11.4-.2-12.4 12.2-.7 7.9 2.9 11.4 5.4 11"/></g><g transform="translate(116 120)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(57 132)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(86 184)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-2 -17)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(71 151)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(71 89)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M73.9 102a57.1 57.1 0 0 1 5-14.8c2.8-4.9 8.7-9.3 16.2-12.8a89.7 89.7 0 0 1 26.2-7.6c19-2.5 40.4.5 53.6 14.5.3.3.4.7.3 1.2 2.1 4 4.3 9.8 6.3 16.8 1.3-.5 3-.9 4.6-.7 2 0 4 .9 5.2 3 2 3.6 2.2 9.1.7 15.4a7.4 7.4 0 0 1-3 4.7c-.9.5-1.7.8-2.5 1 1.2 7.8 2.1 16 2.5 24.3.5 13.2-.3 26.3-3.3 37.3-3 11-8.4 20-17 24.7a78.6 78.6 0 0 1-56 8 51 51 0 0 1-37.2-31.5 161.1 161.1 0 0 1-5.1-49.6 246 246 0 0 1 .3-8.4 4.9 4.9 0 0 1-4.9-2.1 17.4 17.4 0 0 1-2.6-8.2c-.7-5.7.2-10 2.3-12.8a7 7 0 0 1 4-2.7c1.4-.4 3-.2 4.4.3Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M79 87.3c-10.5 19.4-10.9 77.8-3.3 99 11.5 32.3 56.4 43.4 93.3 23.3 33.3-18.1 18-105 6.1-127.6"/><path d="M183 100.2c2.5-1.1 6.8-1.7 8.6 1.5 1.9 3.2 2 8.4.6 14.7-1 4-3.8 4.8-5.7 4.8M72.7 103c-6-2.6-10.8 2.6-9.5 13.7 1 7.8 3.4 9.6 6 9.3"/></g><g transform="translate(115 126)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(61 138)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(98 188)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-2 -23)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(71 156)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(70 84)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M75 97.4a66.3 66.3 0 0 1 6-18.2c2.8-4.9 8.8-9.3 16.2-12.9a90.8 90.8 0 0 1 26.4-7.5c19-2.5 40.1.4 53.4 13.9.3 0 .5.3.7.5a38.4 38.4 0 0 1 5.5 23.8c.9 0 1.9 0 2.9.2 1.5.5 2.9 1.6 4 3.4.6 1 .8 2.4.9 3.7 0 1.4 0 2.9-.3 4.3-.6 3-1.6 6-3 8.2-2.2 3.7-4.6 4.7-6.2 5h-.2l-2.1 15c-4.2 27.3-11 49.4-19.2 64.9-4 7.7-8.5 14-13.1 18.3a26.6 26.6 0 0 1-14.4 7.9c-8.8 1.2-24.8-4.6-41.3-35.6a168.2 168.2 0 0 1-17.8-69.7 7 7 0 0 1-4.4-2.3 13.7 13.7 0 0 1-3.3-6.7c-1.4-6.7-.5-11.3 1.8-14 2-2.4 5-3 7.5-2.2Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M182.8 98.1c2.3-.3 5-.3 6.8 2.9 1.8 3.2.1 11-2.3 15-2 3.5-4.2 4.3-5.4 4.5M74 98.7c-4.3-2-11.1 1.2-8.4 14.6 1.1 5.2 4.6 8.4 7.1 8"/><path d="M81 79.4c-14.7 29-6 82.7 10.6 114.3 16.6 31.6 32.4 36.8 40.4 35.7 18.5-2.6 37.9-36.2 46.3-92.3C184 99.5 184 83 177.1 73"/></g><g transform="translate(117 128)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(62 148)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(97 191)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(0 -31)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(70 157)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(72 80)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M122.4 75.3c18.8-2.5 39.9.4 53.1 13.9l.6.2c3 2 4.6 4.2 6 7.5 1 2.7 1.8 6 2.8 10.5 1.3.1 3.5.5 5.4 2.1 2.2 2 3.3 5.5 2.3 11.2-.8 4.9-1.6 7.7-3.5 11-.7 1.5-1.8 3-3 4a4.8 4.8 0 0 1-5.2.5 249.6 249.6 0 0 1-18.5 46.7 93 93 0 0 1-15.2 20.2 27.8 27.8 0 0 1-19.2 8.4 16 16 0 0 1-8.5-3.3 58 58 0 0 1-9.4-8.3 194.4 194.4 0 0 1-36.2-59.6c-1.6.5-3.8.3-5.8-1.6-2-1.8-3.6-5.2-4.7-10.9-2-10.9 4.2-17.2 9.2-17.2h.1c1-4.2 1.9-7 2.8-9 1.2-2.7 2.5-4.1 4-5.8a72.8 72.8 0 0 0 1.3-1.5C83.9 90 89.4 86.1 96 83a90 90 0 0 1 26.3-7.6Z" fill="${
      colors.base.value
    }"/><g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M185.5 108.6c2.2 0 9 .8 7 11.9-.8 4.9-1.6 7.5-3.4 10.8-1.5 2.9-3.7 5.2-6.4 3.9M71.3 111.8c-3.8 0-10 5.4-8 16 2.3 11.3 6.6 12.2 8.8 11.5"/><path d="M80.5 95c-4 4.9-5.7 4.9-9.7 25.7-4 20.8 38.7 91.3 57.2 91.3 14 0 24.2-12.4 33.8-28.5 6.7-11.2 26-61.3 23.4-73.3-2.6-12-3.5-16.6-9-20.2"/></g><g transform="translate(116 119)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(60 131)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(97 178)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-1 -14)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(72 148)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(72 92)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M78.7 115c-6.1 8.7-10.8 34.3-.6 51 11.6 22.5 35.3 28.9 59.6 26.6a54.7 54.7 0 0 0 45.7-38A56 56 0 0 0 175 109"/><path d="M181.2 118.4c2.6-1.2 5.6-1.7 7.4 1.5 1.9 3.2 3.2 7.3 1.7 13.6-1 4-3.3 4.9-5.3 4.9M73 124.6c-4.2-2-9.1 2.3-7.8 13.4 1 7.8 4 9.5 6.5 9.2"/></g><g transform="translate(113 126)">${
      components.nose?.value(components, colors) ?? ''
    }</g><g transform="translate(62 112)">${
      components.beard?.value(components, colors) ?? ''
    }</g><g transform="translate(98 169)">${
      components.mouth?.value(components, colors) ?? ''
    }</g><g transform="translate(-2 4)">${
      components.top?.value(components, colors) ?? ''
    }</g><g transform="translate(69 153)">${
      components.mustache?.value(components, colors) ?? ''
    }</g><g transform="translate(72 106)">${
      components.eyes?.value(components, colors) ?? ''
    }</g>`,
};
