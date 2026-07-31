import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles.ts';

// Avatar styles to flag with a "New" badge in the sidebar. These are the styles
// added in the most recent @dicebear/styles release that introduced new styles
// (v10.0.0). Update this set when new styles ship. The badge markup is rendered
// via v-html (see `.vp-sidebar-badge` in theme/styles/main.scss).
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
