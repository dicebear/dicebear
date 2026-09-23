import { capitalCase } from 'change-case';
import type { DefaultTheme } from 'vitepress';
import avatarStyles from './avatarStyles.ts';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(avatarStyles)
      .sort((a, b) => a.localeCompare(b))
      .map((styleName) => {
        const label = capitalCase(styleName);

        return { text: label, link: `/styles/${styleName}/` };
      }),
  },
];

export default sidebar;
