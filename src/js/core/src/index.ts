import { Style as StyleBase, type StyleDefinition } from './Style.js';
import { Avatar as AvatarBase } from './Avatar.js';
import { StyleValidator } from './Validator/StyleValidator.js';
import { OptionsValidator } from './Validator/OptionsValidator.js';
import type { NoInferStyle, StyleOptions } from './StyleOptions.js';

/**
 * A style whose definition passes {@link StyleValidator} before it is parsed.
 * `@dicebear/core/lite` exports the same class without the validation, for
 * definitions that come from your own code.
 */
export class Style<D = unknown> extends StyleBase<D> {
  constructor(data: D) {
    StyleValidator.validate(data);
    super(data);
  }
}

/**
 * An avatar whose options pass {@link OptionsValidator} before it renders.
 * `@dicebear/core/lite` exports the same class without the validation, for
 * options that come from your own code.
 */
export class Avatar<D = unknown> extends AvatarBase<D> {
  constructor(
    style: StyleBase<D>,
    optionsInput?: StyleOptions<NoInferStyle<D>>,
  ) {
    OptionsValidator.validate(optionsInput);
    super(style, optionsInput);
  }
}

export type { StyleDefinition };
export { OptionsDescriptor } from './OptionsDescriptor.js';
export type { StyleOptions } from './StyleOptions.js';
export { ValidationError } from './Error/ValidationError.js';
export type { ValidationErrorDetail } from './Error/ValidationError.js';
export { StyleValidationError } from './Error/StyleValidationError.js';
export { OptionsValidationError } from './Error/OptionsValidationError.js';
export { CircularColorReferenceError } from './Error/CircularColorReferenceError.js';
