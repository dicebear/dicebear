import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  default: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M27.93 46a1 1 0 0 1 1-1h9.14a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-1.14a5 5 0 0 1-5-5Z" fill="#66253C"/><path d="M35.76 50.7a5 5 0 0 1-1.69.3h-1.14a5 5 0 0 1-5-4.8c.77-.29 1.9-.25 3.02-.22L32 46c2.21 0 4 1.57 4 3.5 0 .42-.09.83-.24 1.2Z" fill="#B03E67"/><path d="M29 45h10v1a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-1Z" fill="#fff"/>`,
  missingTooth: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M27.93 46a1 1 0 0 1 1-1h9.14a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-1.14a5 5 0 0 1-5-5Z" fill="#66253C"/><path d="M35.76 50.7a5 5 0 0 1-1.69.3h-1.14a5 5 0 0 1-5-4.8c.77-.29 1.9-.25 3.02-.22L32 46c2.21 0 4 1.57 4 3.5 0 .42-.09.83-.24 1.2Z" fill="#B03E67"/><path d="M29 45h10v1a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-1Z" fill="#fff"/><path d="M31 45.3c0-.17.13-.3.3-.3h1.4c.17 0 .3.13.3.3v2.4a.3.3 0 0 1-.3.3h-1.4a.3.3 0 0 1-.3-.3v-2.4Z" fill="#B03E67"/>`,
};
