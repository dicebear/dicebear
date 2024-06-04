import { AvatarBuilder } from './AvatarBuilder.js';
import { ValidationHelper } from './helpers/ValidationHelper.js';
import { StyleModel } from './models/StyleModel.js';
import { Definition, Options, StyleOptions } from './types';

export class DiceBear {
  static createStyle<S extends StyleOptions>(
    definition: Definition,
  ): StyleModel<S> {
    const validatedDefinition = ValidationHelper.validateDefinition(definition);

    return new StyleModel<S>(validatedDefinition);
  }

  static createAvatar<S extends StyleOptions>(
    style: StyleModel<S>,
    options: Partial<Options<S>> = {},
  ) {
    const validatedOptions = ValidationHelper.validateOptions(style, options);

    return new AvatarBuilder(style, validatedOptions).build();
  }
}
