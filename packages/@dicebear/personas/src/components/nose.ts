import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const nose: ComponentGroup = {
  mediumRound: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M4.25 5a.75.75 0 0 1 1.5 0c0 .836.914 1.75 2.25 1.75 1.336 0 2.25-.914 2.25-1.75a.75.75 0 0 1 1.5 0c0 1.664-1.586 3.25-3.75 3.25-2.164 0-3.75-1.586-3.75-3.25Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>
`,
  smallRound: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5.289 6.237a.75.75 0 1 1 1.423-.474c.233.699.617.987 1.288.987s1.056-.288 1.289-.987a.75.75 0 1 1 1.422.474C10.278 7.538 9.33 8.25 8 8.25s-2.278-.712-2.711-2.013Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>
`,
  wrinkles: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".119" fill-rule="evenodd" clip-rule="evenodd" d="M11.721 5.294c.21.736.273 1.39.195 1.955.349.543.643 1.041.883 1.493.447.843.86 1.817 1.238 2.92a.5.5 0 1 0 .946-.324 21.232 21.232 0 0 0-1.3-3.065c-.473-.89-1.137-1.934-1.996-3.135a.499.499 0 0 0-.099-.104c.06.075.105.162.133.26Zm-7.442 0a.748.748 0 0 1 .115-.237.502.502 0 0 0-.071.08C3.464 6.34 2.799 7.384 2.328 8.274a21.224 21.224 0 0 0-1.301 3.065.5.5 0 0 0 .946.324 20.24 20.24 0 0 1 1.238-2.92c.238-.448.53-.942.875-1.48-.08-.568-.019-1.227.193-1.968Z" fill="#000"/>
  <path d="M5.206 4.779a.75.75 0 0 0-.927.515c-.212.741-.274 1.4-.193 1.968C4.314 8.866 5.68 9.75 8 9.75c2.328 0 3.693-.888 3.916-2.501.078-.565.015-1.22-.195-1.955a.749.749 0 0 0-.927-.515.75.75 0 0 0-.515.927C10.802 7.536 10.19 8.25 8 8.25s-2.802-.713-2.279-2.544a.75.75 0 0 0-.515-.927Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>
`,
};
