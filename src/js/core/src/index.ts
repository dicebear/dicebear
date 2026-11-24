import { Style as StyleBase, type StyleDefinition } from './Style.js';
import { Avatar as AvatarBase } from './Avatar.js';
import { StyleValidator } from './Validator/StyleValidator.js';
import { OptionsValidator } from './Validator/OptionsValidator.js';
import type { NoInferStyle, StyleOptions } from './StyleOptions.js';
import { StyleValidationError } from './Error/StyleValidationError.js';
import { OptionsValidationError } from './Error/OptionsValidationError.js';
import { Depth } from './Utils/Depth.js';

/**
 * A style whose definition is checked against the definition schema before
 * it is parsed. `@dicebear/core/lite` exports the same class without the
 * check, for definitions that come from your own code.
 */
export class Style<D = unknown> extends StyleBase<D> {
  constructor(data: D) {
    if (Depth.exceeds(data)) {
      throw new StyleValidationError([{ message: Depth.MESSAGE }]);
    }

    StyleValidator.validate(data);
    super(data);
  }
}

/**
 * An avatar whose options are checked against the options schema before it
 * renders. `@dicebear/core/lite` exports the same class without the check,
 * for options that come from your own code.
 */
export class Avatar<D = unknown> extends AvatarBase<D> {
  constructor(
    style: StyleBase<D>,
    optionsInput?: StyleOptions<NoInferStyle<D>>,
  ) {
    if (Depth.exceeds(optionsInput)) {
      throw new OptionsValidationError([{ message: Depth.MESSAGE }]);
    }

    OptionsValidator.validate(optionsInput ?? {});
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
