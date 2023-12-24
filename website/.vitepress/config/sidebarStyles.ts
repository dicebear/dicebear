import { capitalCase, paramCase } from 'change-case';
import * as collection from '@dicebear/collection';
import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Styles',
    items: Object.keys(collection).map((styleName) => ({
      text: capitalCase(styleName),
      link: `/styles/${paramCase(styleName)}/`,
    })),
  },
];

export default sidebar;
