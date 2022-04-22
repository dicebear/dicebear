import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const mouth: ComponentGroup = {
  sad10: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9v1h1v1h1V9H7Z" fill="${colors.mouth.value}"/>`,
  sad09: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 10v1h1v-1h3V9H7v1H6Z" fill="${colors.mouth.value}"/>`,
  sad08: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 9v1h3v1h1v-1H9V9H6Z" fill="${colors.mouth.value}"/>`,
  sad07: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9h2v1H7V9Z" fill="${colors.mouth.value}"/>`,
  sad06: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 9h4v1H6V9Z" fill="${colors.mouth.value}"/>`,
  sad05: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9h3v1H7V9Z" fill="${colors.mouth.value}"/>`,
  sad04: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 9h3v1H6V9Z" fill="${colors.mouth.value}"/>`,
  sad03: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M9 9v1H7v1H6v-1h1V9h2Z" fill="${colors.mouth.value}"/>`,
  sad02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9v1h2v1h1v-1H9V9H7Z" fill="${colors.mouth.value}"/>`,
  sad01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9h2v1H7V9ZM7 10v1H6v-1h1ZM9 10v1h1v-1H9Z" fill="${colors.mouth.value}"/>`,
  happy13: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 10v1h1v1h2v-1h1v-1H9V9H7v1H6Z" fill="${colors.mouth.value}"/><path d="M7 10v1h2v-1H7Z" fill="none"/>`,
  happy12: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 10v1h1v1h2v-1h1v-1H9V9H7v1H6Z" fill="${colors.mouth.value}"/><path d="M7 10v1h2v-1H7Z" fill="#fff"/>`,
  happy11: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 9v1h1v1h2v-1H7V9H6Z" fill="${colors.mouth.value}"/>`,
  happy10: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M10 9v1H9v1H7v-1h2V9h1Z" fill="${colors.mouth.value}"/>`,
  happy09: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 11h2v-1H7v1ZM7 10V9H6v1h1ZM9 10V9h1v1H9Z" fill="${colors.mouth.value}"/>`,
  happy08: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 11v-1h3V9h1v1H9v1H6Z" fill="${colors.mouth.value}"/>`,
  happy07: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M10 11v-1H7V9H6v1h1v1h3Z" fill="${colors.mouth.value}"/>`,
  happy06: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M6 9v1h1v1h2v-1h1V9H6Z" fill="${colors.mouth.value}"/>`,
  happy05: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9v2h2v-1H8V9H7Z" fill="${colors.mouth.value}"/><path d="M9 11v-1H8V9H7v1h1v1h1Z" fill="none"/>`,
  happy04: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M9 9v1H8v1h2V9H9Z" fill="${colors.mouth.value}"/>`,
  happy03: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9v1h1v1H6V9h1Z" fill="${colors.mouth.value}"/>`,
  happy02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M8 10v1h1v-1H8Z" fill="${colors.mouth.value}"/>`,
  happy01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M7 9v2h2V9H7Z" fill="${colors.mouth.value}"/>`,
};
