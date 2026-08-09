import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles.ts';

// Avatar styles to flag with a "New" badge in the sidebar: everything that
// shipped during v10, from the v10.0.0 styles to the voxel styles in v10.4.0.
// Update this set when new styles ship. The badge markup is rendered via
// v-html (see `.vp-sidebar-badge` in theme/styles/main.scss).
const NEW_STYLES = new Set<string>([
  'blobs',
  'clay',
  'constellation',
  'critters',
  'disco',
  'glyphs',
  'initial-face',
  'landscape',
  'loops',
  'moods',
  'pixelbot',
  'planets',
  'shape-grid',
  'sprouts',
  'squircles',
  'stripes',
  'triangles',
  'voxel-art',
  'voxel-bot',
  'waves',
  'weave',
]);

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(avatarStyles)
      .sort((a, b) => a.localeCompare(b))
      .map((styleName) => {
        const label = capitalCase(styleName);

        return {
          text: NEW_STYLES.has(styleName)
            ? `${label} <span class="vp-sidebar-badge is-new">New</span>`
            : label,
          link: `/styles/${styleName}/`,
        };
      }),
  },
];

export default sidebar;
