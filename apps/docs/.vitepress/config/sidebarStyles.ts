import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles.ts';

// Avatar styles to flag with a "New" badge in the sidebar: the ones a 10.x
// minor added. The six that shipped with 10.0.0 are as old as v10 itself and
// carry no badge. Update this set when new styles ship. The badge markup is
// rendered via v-html (see `.vp-sidebar-badge` in theme/styles/main.scss).
const NEW_STYLES = new Set<string>([
  'blobs',
  'cameo',
  'clay',
  'constellation',
  'critters',
  'cutouts',
  'gaze',
  'landscape',
  'line-face',
  'loops',
  'marbles',
  'moods',
  'patchwork',
  'pixelbot',
  'planets',
  'shadows',
  'slice',
  'sprouts',
  'squircles',
  'stack',
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
