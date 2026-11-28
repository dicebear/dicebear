// The same API as the package root, without the validators. A bundle that
// imports this entry leaves `StyleValidator` and `OptionsValidator` out, and
// with them the two compiled schemas, which is about half of the library.
// Use it when the style definitions and the options come from your own code,
// and stay on the root entry when either arrives from outside.
export { Style, type StyleDefinition } from './Style.js';
export { Avatar } from './Avatar.js';
export { OptionsDescriptor } from './OptionsDescriptor.js';
export type { StyleOptions } from './StyleOptions.js';
// The lite entry validates nothing, but the circular color check still runs,
// and code shared with the root entry may catch the validation errors.
export { ValidationError } from './Error/ValidationError.js';
export type { ValidationErrorDetail } from './Error/ValidationError.js';
export { StyleValidationError } from './Error/StyleValidationError.js';
export { OptionsValidationError } from './Error/OptionsValidationError.js';
export { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
