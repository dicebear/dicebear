import { escape } from '@dicebear/core';
	import type {
	  ComponentGroup,
	  ComponentPickCollection,
	  ColorPickCollection,
	} from '../types.js';
	export const glasses: ComponentGroup = {
	  light07: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4H9v1H7V4H4v1H2v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5h-2V4Zm0 1v3H9V5h3ZM7 8H4V5h3v3Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#fff" fill-opacity=".3" d="M9 5h3v3H9zM4 5h3v3H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/>`,
	  light06: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H2Zm10 3H9V6h3v2ZM7 8H4V6h3v2Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#fff" fill-opacity=".3" d="M9 6h3v2H9zM4 6h3v2H4z"/><path fill="#fff" fill-opacity=".2" d="M7 5h2v1H7zM2 5h2v1H2zM12 5h2v1h-2z"/>`,
	  light05: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H9v1H7V5H2Zm5 1v2H4V6h3Zm2 0v2h3V6H9Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v2H4zM9 6h3v2H9z"/><path fill="#fff" fill-opacity=".2" d="M2 5h2v1H2zM12 5h2v1h-2z"/>`,
	  light04: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="#fff" fill-opacity=".3" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${escape.xml(
	      `#${colors.glasses}`
	    )}" d="M3 5h1v1H3zM7 5h2v1H7zM12 5h1v1h-1z"/>`,
	  light03: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(
	      `#${colors.glasses}`
	    )}" d="M2 5h12v1H2zM3 7h10v1H3zM3 6h1v1H3zM12 6h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M4 6h8v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M7 6h2v1H7z"/>`,
	  light02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M14 5H2v1h1v2h4V7h2v1h4V6h1V5Zm-2 1H9v1h3V6ZM7 7H4V6h3v1Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM7 5h2v1H7zM13 5h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M9 6h3v1H9z"/>`,
	  light01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 5h5v1H4v1H3V6H2V5ZM7 7v1H4V7h3ZM9 7H7V6h2v1ZM12 7H9v1h3V7ZM12 6H9V5h5v1h-1v1h-1V6Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v1H4zM9 6h3v1H9z"/><path fill="#fff" fill-opacity=".2" d="M12 5h2v1h-2zM2 5h2v1H2zM7 6h2v1H7z"/>`,
	  dark07: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4H9v1H7V4H4v1H2v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5h-2V4Zm0 1v3H9V5h3ZM7 8H4V5h3v3Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#000" fill-opacity=".3" d="M9 5h3v3H9zM4 5h3v3H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/>`,
	  dark06: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H2Zm10 3H9V6h3v2ZM7 8H4V6h3v2Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#000" fill-opacity=".3" d="M9 6h3v2H9zM4 6h3v2H4z"/><path fill="#fff" fill-opacity=".2" d="M7 5h2v1H7zM2 5h2v1H2zM12 5h2v1h-2z"/>`,
	  dark05: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H9v1H7V5H2Zm5 1v2H4V6h3Zm2 0v2h3V6H9Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v2H4zM9 6h3v2H9z"/><path fill="#fff" fill-opacity=".2" d="M2 5h2v1H2zM12 5h2v1h-2z"/>`,
	  dark04: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="#000" fill-opacity=".3" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${escape.xml(
	      `#${colors.glasses}`
	    )}" d="M3 5h1v1H3zM7 5h2v1H7zM12 5h1v1h-1z"/>`,
	  dark03: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill="${escape.xml(
	      `#${colors.glasses}`
	    )}" d="M2 5h12v1H2zM3 7h10v1H3zM3 6h1v1H3zM12 6h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M4 6h8v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M7 6h2v1H7z"/>`,
	  dark02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path fill-rule="evenodd" clip-rule="evenodd" d="M14 5H2v1h1v2h4V7h2v1h4V6h1V5Zm-2 1H9v1h3V6ZM7 7H4V6h3v1Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM7 5h2v1H7zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M9 6h3v1H9z"/>`,
	  dark01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
	    `<path d="M2 5h5v1H4v1H3V6H2V5ZM7 7v1H4V7h3ZM9 7H7V6h2v1ZM12 7H9v1h3V7ZM12 6H9V5h5v1h-1v1h-1V6Z" fill="${escape.xml(
	      `#${colors.glasses}`
	    )}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v1H4zM9 6h3v1H9z"/><path fill="#fff" fill-opacity=".2" d="M12 5h2v1h-2zM2 5h2v1H2zM7 6h2v1H7z"/>`,
	};
