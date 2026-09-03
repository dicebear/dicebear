// The same API as the package root, without the schema validators. A
// bundle that imports this entry leaves the two compiled validators out,
// which is about half of the library. Use it when the style definitions and
// the options come from your own code, and stay on the root entry when
// either arrives from outside.
export { Style, type StyleDefinition } from './Style.js';
export { Avatar } from './Avatar.js';
export { Color } from './Utils/Color.js';
export { OptionsDescriptor } from './OptionsDescriptor.js';
export type { StyleOptions } from './StyleOptions.js';
