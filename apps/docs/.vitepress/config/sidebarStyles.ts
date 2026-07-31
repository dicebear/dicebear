import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles.ts';

// Avatar styles to flag with a "New" badge in the sidebar. These are the styles
// added in the most recent @dicebear/styles release that introduced new styles
// (v10.0.0). Update this set when new styles ship. The badge markup is rendered
// via v-html (see `.vp-sidebar-badge` in theme/styles/main.scss).
const NEW_STYLES = new Set<string>([
  'disco',
  'glyphs',
  'initial-face',
  'shape-grid',
  'stripes',
  'triangles',
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
