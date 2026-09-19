/** The plugin screenshots under `pages/public/studio/`, each in light and dark. */
export type StudioShotName =
  | 'gallery'
  | 'seeds'
  | 'fill'
  | 'insert'
  | 'library'
  | 'inspect'
  | 'style-frame';

export interface StudioShotImage {
  name: StudioShotName;
  alt: string;
}

export type StudioTheme = 'light' | 'dark';

export interface StudioLink {
  text: string;
  href: string;
}

/** One function of the plugin: text on the left, its screenshot on the right. */
export interface StudioFeature {
  title: string;
  text: string;
  shot: StudioShotImage;
  links?: StudioLink[];
}

/** The plugin in the Figma Community and its guide in the docs. */
export const STUDIO_PLUGIN_URL =
  'https://www.figma.com/community/plugin/1005765655729342787';
export const STUDIO_GUIDE_PATH = '/integrations/figma/';
