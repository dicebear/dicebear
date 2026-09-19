/**
 * The tools on the overview page. The list on the page and the Markdown
 * mirror of it both read from here.
 */
export type ToolEntry = {
  slug: string;
  href: string;
  /** Host shown in place of "Open" for links that leave the site. */
  host?: string;
  name: string;
  /** One sentence. May contain inline `<code>`. */
  text: string;
};

export const tools: ToolEntry[] = [
  {
    slug: 'playground',
    href: '/playground/',
    name: 'Playground',
    text: 'Pick a style, tune every option and preview the result live. Download SVGs in bulk and copy the generated code.',
  },
  {
    slug: 'editor',
    href: 'https://editor.dicebear.com',
    host: 'editor.dicebear.com',
    name: 'Editor',
    text: 'Design your own DiceBear-compatible avatar style in a visual editor. Export the definition and use it like any built-in style.',
  },
  {
    slug: 'studio',
    href: 'https://www.figma.com/community/plugin/1005765655729342787',
    host: 'figma.com',
    name: 'DiceBear Studio',
    text: 'Export an avatar style straight out of Figma, or import a definition file and edit an existing style in Figma.',
  },
  {
    slug: 'contrast',
    href: '/tools/contrast/',
    name: 'WCAG Contrast Picker',
    text: 'See which contrast color DiceBear picks for any background, with the WCAG 2.1 contrast ratio from <code>@dicebear/core</code>.',
  },
  {
    slug: 'bundle-size',
    href: '/tools/bundle-size/',
    name: 'Bundle Size Estimator',
    text: 'See how much each style adds to your bundle, minified and gzipped.',
  },
];
