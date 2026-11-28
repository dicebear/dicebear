import { OptionsValidationError } from '../Error/OptionsValidationError.js';
import { Depth } from '../Utils/Depth.js';
import { Finite } from '../Utils/Finite.js';
import { OptionsSchemaValidator } from './OptionsSchemaValidator.js';

/**
 * Validates avatar options: the nesting depth, the `options.json` schema, and
 * that every number is finite, which the compiled schema validator does not
 * enforce everywhere. Throws an {@link OptionsValidationError} on the first
 * check that fails.
 *
 * The package root runs it before an {@link Avatar} is built. The lite entry
 * skips it, as it skips every validator.
 */
export class OptionsValidator {
  static validate(data: unknown): void {
    if (Depth.exceeds(data)) {
      throw new OptionsValidationError([{ message: Depth.MESSAGE }]);
    }

    OptionsSchemaValidator.validate(data ?? {});

    const nonFinite = Finite.find(data);

    if (nonFinite !== undefined) {
      throw new OptionsValidationError([
        { instancePath: nonFinite, keyword: 'type', message: Finite.MESSAGE },
      ]);
    }
  }
}
