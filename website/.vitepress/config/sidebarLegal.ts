import { capitalCase, paramCase } from 'change-case';
import * as collection from '@dicebear/collection';
import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'English',
    items: [
      { text: 'Privacy Policy', link: '/legal/privacy-policy/' },
      { text: 'Site Notice', link: '/legal/site-notice/' },
    ],
  },
  {
    text: 'Deutsch',
    items: [
      { text: 'Datenschutzerklärung', link: '/legal/privacy-policy/de/' },
      { text: 'Impressum', link: '/legal/site-notice/de/' },
    ],
  },
];

export default sidebar;
