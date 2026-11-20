<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\OptionsValidationError;

/**
 * Validates avatar options against the shared `options.json` schema.
 *
 * @internal
 */
class OptionsValidator extends AbstractValidator
{
    /**
     * @inheritDoc
     */
    protected static function schemaFile(): string
    {
        return 'options.json';
    }

    /**
     * @inheritDoc
     *
     * Empty arrays are coerced to `stdClass` so they validate as JSON objects
     * rather than empty arrays.
     *
     * Options that `json_encode()` cannot encode, such as ill-formed UTF-8 in
     * an option other than the seed or the title, are invalid options and
     * throw the error for them.
     */
    protected static function toObject(mixed $data): mixed
    {
        if (!is_array($data)) {
            return $data;
        }

        if (empty($data)) {
            return new \stdClass();
        }

        try {
            return json_decode(json_encode($data, JSON_THROW_ON_ERROR));
        } catch (\JsonException $exception) {
            static::throwError([['message' => $exception->getMessage()]]);
        }
    }

    /**
     * @inheritDoc
     */
    protected static function throwError(array $details): never
    {
        throw new OptionsValidationError($details);
    }
}
