import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const mouth: ComponentGroup = {
  'smile': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5.004 5.868a1 1 0 1 1 .992-1.736C7.016 4.715 8.014 5 9 5c.986 0 1.983-.285 3.004-.868a1 1 0 1 1 .992 1.736C11.684 6.618 10.348 7 9 7c-1.348 0-2.684-.382-3.996-1.132Z" fill="#1B0640"/>
`,
  'frown': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5.004 4.132a1 1 0 1 0 .992 1.736C7.016 5.285 8.014 5 9 5c.986 0 1.983.285 3.004.868a1 1 0 1 0 .992-1.736C11.684 3.382 10.348 3 9 3c-1.348 0-2.684.382-3.996 1.132Z" fill="#1B0640"/>
`,
  'surprise': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <ellipse cx="9" cy="5" rx="2" ry="2.5" fill="#1B0640"/>
`,
  'pacifier': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a6.611 6.611 0 0 1-2.27-.412A2.035 2.035 0 0 0 4 3.5a3.5 3.5 0 0 0 2.004 3.165 3 3 0 0 0 5.992 0A3.5 3.5 0 0 0 14 3.5a2.035 2.035 0 0 0-2.73-1.912A6.61 6.61 0 0 1 9 2ZM7.585 7h2.83a1.5 1.5 0 0 1-2.83 0Z" fill="#456DFF"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.5c0 .055-.002.11-.005.165A3.5 3.5 0 0 0 14 3.5a2.035 2.035 0 0 0-2.73-1.912A6.61 6.61 0 0 1 9 2a6.611 6.611 0 0 1-2.27-.412A2.035 2.035 0 0 0 4 3.5a3.5 3.5 0 0 0 2.004 3.165A3 3 0 1 1 12 6.5ZM7.585 7h2.83a1.5 1.5 0 1 0-2.83 0Z" fill="#fff" fill-opacity=".26" style="mix-blend-mode:lighten"/>
  <circle cx="9" cy="4.5" r="1.5" fill="#fff"/>
`,
  'bigSmile': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M6 3h6v1a3 3 0 0 1-6 0V3Z" fill="#fff"/>
`,
  'smirk': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7.318 5.728a.75.75 0 0 1 .364-1.456c2.433.609 4.165.32 5.288-.802a.75.75 0 1 1 1.06 1.06c-1.544 1.545-3.812 1.923-6.712 1.198Z" fill="#1B0640"/>
`,
  'lips': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 5h8s-1 2.5-4 2.5S5 5 5 5Z" fill="#DC5C7A"/>
  <path d="M5.388 4.225C6.106 2.788 8.108 2.663 9 4c.891-1.337 2.894-1.212 3.613.225L13 5H5l.388-.775Z" fill="#F57B98"/>
`,
}
