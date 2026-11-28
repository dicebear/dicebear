<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\OptionsValidationError;

/**
 * Validates avatar options. Runs {@see OptionsSchemaValidator}; the options
 * need no checks beyond the schema.
 *
 * @internal
 */
class OptionsValidator
{
    /**
     * Validates the given options.
     *
     * Throws an {@see OptionsValidationError} on failure.
     */
    public static function validate(mixed $data): void
    {
        OptionsSchemaValidator::validate($data);
    }
}
