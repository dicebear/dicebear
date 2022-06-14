import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const ear: ComponentGroup = {
	  variant08: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<path d="M70.9 16A40.4 40.4 0 0 0 31 47.3V109c24.3-3.3 67.7-24.5 74-45 6.2-20.6-1-48-34.1-48Z" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><path d="M69.3 27.7c-19 0-27 15-28.6 22.5v44.1c17.5-2.3 48.5-17.5 53-32.2 4.5-14.7-.7-34.4-24.4-34.4Z" fill="#000" fill-opacity=".2"/><path d="M52.4 62.7c0-11.3-7.8-15-11.7-15.4v33.3a18.5 18.5 0 0 0 11.7-18Z" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/>`,
	  variant07: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="30" y="23" width="80" height="80" rx="21.3" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><rect x="38.9" y="31.9" width="42.6" height="62.2" rx="12.4" fill="#000" fill-opacity=".2"/><rect x="30" y="46.1" width="17.8" height="35.5" rx="8.9" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/>`,
	  variant06: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="27" y="21" width="80" height="80" rx="21.3" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><rect x="35.9" y="29.9" width="62.2" height="62.2" rx="12.4" fill="#000" fill-opacity=".2"/><rect x="28.8" y="44.1" width="17.8" height="35.5" rx="5.3" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/>`,
	  variant05: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<path d="M24 43.3C24 31.5 33.5 22 45.3 22h37.2c11.8 0 21.4 9.5 21.4 21.3v37.3c0 11.8-9.6 21.4-21.4 21.4H45.3A21.3 21.3 0 0 1 24 80.6V43.3Z" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><path d="M32.9 62A31 31 0 1 1 95 62a31 31 0 1 1-62.1 0Z" fill="#000" fill-opacity=".2"/>`,
	  variant04: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="23" y="20" width="88" height="88.1" rx="44" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><path d="M47.6 57.5c2.5-6 18-32 34.5-17.2 12.7 11.3-15 33.2-16.5 22.2C64 51.5 99 52 89 78.5 84.8 90 62 91 47.6 77" stroke="#000" stroke-opacity=".2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
	  variant03: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="22" y="19" width="88.1" height="88.1" rx="44.1" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><path d="m79 38.5-39 29L83.5 87" stroke="#000" stroke-opacity=".2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
	  variant02: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="21" y="21" width="88.1" height="88.1" rx="44.1" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><path d="M87 43 42.5 84.5" stroke="#000" stroke-opacity=".2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
	  variant01: (
	    components: ComponentPickCollection,
	    colors: ColorPickCollection
	  ) =>
	    `<rect x="20" y="22" width="88" height="88.1" rx="44" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/><rect x="29.8" y="31.8" width="68.4" height="68.5" rx="34.2" fill="#000" fill-opacity=".2"/><rect x="23.9" y="49.4" width="37.2" height="37.2" rx="18.6" fill="${escape.xml(
	      `#${colors.skin}`
	    )}"/>`,
	};
