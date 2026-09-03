import { Style as StyleBase, type StyleDefinition } from './Style.js';
import { Avatar as AvatarBase } from './Avatar.js';
import { StyleValidator } from './Validator/StyleValidator.js';
import { OptionsValidator } from './Validator/OptionsValidator.js';
import type { StyleOptions } from './StyleOptions.js';

/**
 * A style whose definition is checked against the definition schema before
 * it is parsed. `@dicebear/core/lite` exports the same class without the
 * check, for definitions that come from your own code.
 */
export class Style<D = unknown> extends StyleBase<D> {
  constructor(data: D) {
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
  constructor(style: StyleBase<D>, optionsInput?: StyleOptions<D>) {
    OptionsValidator.validate(optionsInput ?? {});
    super(style, optionsInput);
  }
}

export type { StyleDefinition };
export { Color } from './Utils/Color.js';
export { OptionsDescriptor } from './OptionsDescriptor.js';
export type { StyleOptions } from './StyleOptions.js';
