import { mask } from 'superstruct';
import { StyleModel } from '../models/StyleModel.js';
import { Definition, Options, StyleOptions } from '../types';
import { DefinitionStruct } from '../structs/DefinitionStruct';

export class ValidationHelper {
  static validateDefinition(definition: unknown): Definition {
    return mask(definition, DefinitionStruct) as Definition;
  }

  static validateOptions<S extends StyleOptions>(
    style: StyleModel<S>,
    options: unknown,
  ): Options<S> {
    return mask(options, style.getStruct()) as Options<S>;
  }
}
