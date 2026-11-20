<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\StyleValidationError;

/**
 * Validates style definitions against the shared `definition.json` schema.
 *
 * @internal
 */
class StyleValidator extends AbstractValidator
{
    /**
     * @inheritDoc
     */
    protected static function schemaFile(): string
    {
        return 'definition.json';
    }

    /**
     * @inheritDoc
     *
     * A definition that `json_encode()` cannot encode, such as one nested
     * deeper than it reads, one that contains itself or one with ill-formed
     * UTF-8, is an invalid definition and throws the error for it.
     */
    protected static function toObject(mixed $data): mixed
    {
        if (!is_array($data)) {
            return $data;
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
        throw new StyleValidationError($details);
    }
}
