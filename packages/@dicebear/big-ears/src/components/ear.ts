import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const ear: ComponentGroup = {
  'variant08': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M70.891 16C44.427 16 33.271 36.884 31 47.326V109c24.324-3.263 67.658-24.474 73.945-45.032C111.232 43.41 103.972 16 70.891 16Z" fill="${colors.skin.value}"/>
  <path d="M69.329 27.747c-18.973 0-26.972 14.95-28.6 22.423v44.146c17.44-2.336 48.506-17.518 53.013-32.233 4.507-14.715-.697-34.336-24.413-34.336Z" fill="#000" fill-opacity=".19"/>
  <path d="M52.405 62.688c0-11.265-7.783-14.935-11.675-15.361V80.61c3.892-1.28 11.675-6.657 11.675-17.923Z" fill="${colors.skin.value}"/>
`,
  'variant07': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="30" y="23" width="79.966" height="79.966" rx="21.324" fill="${colors.skin.value}"/>
  <rect x="38.885" y="31.885" width="42.649" height="62.196" rx="12.439" fill="#000" fill-opacity=".19"/>
  <rect x="30" y="46.102" width="17.77" height="35.541" rx="8.885" fill="${colors.skin.value}"/>
`,
  'variant06': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="27" y="21" width="79.966" height="79.966" rx="21.324" fill="${colors.skin.value}"/>
  <rect x="35.885" y="29.885" width="62.196" height="62.196" rx="12.439" fill="#000" fill-opacity=".19"/>
  <rect x="28.777" y="44.102" width="17.77" height="35.541" rx="5.331" fill="${colors.skin.value}"/>
`,
  'variant05': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M24 43.324C24 31.547 33.547 22 45.324 22h37.218c11.777 0 21.324 9.547 21.324 21.324v37.318c0 11.777-9.547 21.324-21.324 21.324H45.324C33.547 101.966 24 92.419 24 80.642V43.324Z" fill="${colors.skin.value}"/>
  <path d="M32.874 61.983c0-17.153 13.906-31.097 31.059-31.097 17.154 0 31.06 13.944 31.06 31.098 0 17.153-13.906 31.098-31.06 31.098-17.153 0-31.059-13.945-31.059-31.098Z" fill="#000" fill-opacity=".19"/>
`,
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="23" y="20" width="88.005" height="88.115" rx="44.002" fill="${colors.skin.value}"/>
  <path d="M47.6 57.5c2.5-6 18-31.954 34.5-17.191 12.669 11.335-15 33.19-16.5 22.19-1.5-11 33.5-10.5 23.5 16C84.76 90 62.1 91 47.6 77" stroke="#000" stroke-opacity=".19" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="22" y="19" width="88.115" height="88.115" rx="44.058" fill="${colors.skin.value}"/>
  <path d="m79 38.5-39 29L83.5 87" stroke="#000" stroke-opacity=".19" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="21" y="21" width="88.115" height="88.115" rx="44.058" fill="${colors.skin.value}"/>
  <path d="M87 43 42.5 84.5" stroke="#000" stroke-opacity=".19" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="20" y="22" width="88.005" height="88.115" rx="44.002" fill="${colors.skin.value}"/>
  <rect x="29.778" y="31.791" width="68.448" height="68.534" rx="34.224" fill="#000" fill-opacity=".19"/>
  <rect x="23.911" y="49.414" width="37.158" height="37.204" rx="18.579" fill="${colors.skin.value}"/>
`,
}
