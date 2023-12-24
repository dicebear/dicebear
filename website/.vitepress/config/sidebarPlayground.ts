import { capitalCase, paramCase } from 'change-case';
import * as collection from '@dicebear/collection';
import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Playground',
    items: [{ text: 'Playground', link: '/playground/' }],
  },
];

export default sidebar;
