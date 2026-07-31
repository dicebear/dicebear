import type { DefaultTheme } from 'vitepress';

export type AvatarStyleMeta = {
  title?: string;
  creator?: string;
  homepage?: string;
  source?: string;
  license?: {
    name?: string;
    url?: string;
    text?: string;
  };
};

export type AvatarStyle = {
  definitionUrl?: string;
  animated?: boolean;
  meta: AvatarStyleMeta;
};

export type AvatarStyles = Record<string, AvatarStyle>;

export type AvatarUniqueCount = {
  display: string;
  log10: number;
};

export type AvatarStyleSize = {
  raw: number;
  gzip: number;
};

export type AvatarStyleSizeBundle = {
  core: AvatarStyleSize;
  converter: AvatarStyleSize;
  styles: Record<string, AvatarStyleSize>;
};

export type ThemeOptions = {
  avatarStyles: AvatarStyles;
  styleCount: number;
  animatedStyleCount: number;
  avatarUniqueCounts: Record<string, AvatarUniqueCount>;
  avatarStyleSizes: AvatarStyleSizeBundle;
  githubStars: Record<string, string>;
} & DefaultTheme.Config;

export type CustomStyleEntry = {
  name: string;
  definition: object;
};

export type PlaygroundStoreStyle = string;
export type PlaygroundStoreOptions = Record<string, any>;
