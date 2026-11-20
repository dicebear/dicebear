<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use Composer\InstalledVersions;
use Opis\JsonSchema\Errors\ValidationError as OpisValidationError;
use Opis\JsonSchema\Validator;

/**
 * Base class for JSON Schema validators.
 *
 * Subclasses bind a schema file and convert input data into the shape Opis
 * expects, then translate validation failures into a domain-specific error.
 *
 * @internal
 */
abstract class AbstractValidator
{
    /**
     * How many levels of arrays and objects a style definition or the options
     * may nest, counting the value itself as the first. Every port turns down
     * a deeper value as invalid, so a definition renders in all of them or in
     * none. Valid options nest two levels and the deepest style definition
     * uses less than a quarter of the limit.
     */
    public const MAX_DEPTH = 64;

    private static ?Validator $validator = null;
    /** @var array<class-string, object> */
    private static array $schemas = [];

    /**
     * Returns the schema file name (relative to the schema package's `src/`).
     */
    abstract protected static function schemaFile(): string;

    /**
     * Converts the input value to the structure expected by Opis JSON Schema.
     */
    abstract protected static function toObject(mixed $data): mixed;

    /**
     * Throws the subclass-specific validation error.
     *
     * @param list<array{message?: string, instancePath?: string}> $details
     */
    abstract protected static function throwError(array $details): never;

    /**
     * Validates the given data against the bound schema.
     *
     * Throws the subclass-specific validation error on failure.
     */
    public static function validate(mixed $data): void
    {
        if (self::exceedsMaxDepth($data, 1)) {
            static::throwError([
                ['message' => sprintf('nesting is deeper than the %d levels this port reads', self::MAX_DEPTH)],
            ]);
        }

        $result = self::validator()->validate(static::toObject($data), static::schema());

        if (!$result->isValid()) {
            /** @var list<array{message?: string, instancePath?: string}> $details */
            $details = [];

            self::collectErrors($result->error(), $details);

            if (count($details) === 0) {
                $details[] = ['message' => 'Validation failed'];
            }

            static::throwError($details);
        }
    }

    /**
     * Returns whether `$value`, found on level `$depth`, nests arrays and
     * objects deeper than {@see MAX_DEPTH}. The search stops at the first
     * level past the limit, which also ends an array that contains itself
     * through a reference.
     */
    private static function exceedsMaxDepth(mixed $value, int $depth): bool
    {
        if (!is_array($value) && !is_object($value)) {
            return false;
        }

        if ($depth > self::MAX_DEPTH) {
            return true;
        }

        foreach ($value as $item) {
            if (self::exceedsMaxDepth($item, $depth + 1)) {
                return true;
            }
        }

        return false;
    }

    private static function validator(): Validator
    {
        if (self::$validator === null) {
            self::$validator = new Validator();
            self::$validator->setMaxErrors(10);
        }

        return self::$validator;
    }

    /**
     * Returns the parsed schema, cached per concrete subclass.
     */
    protected static function schema(): object
    {
        $key = static::class;

        return self::$schemas[$key] ??= json_decode(
            file_get_contents(self::schemaPath(static::schemaFile())),
        );
    }

    /**
     * Resolves a schema file name to its absolute path inside dicebear/schema.
     */
    private static function schemaPath(string $filename): string
    {
        return InstalledVersions::getInstallPath('dicebear/schema') . '/src/' . $filename;
    }

    /**
     * Walks an Opis validation error tree and flattens leaf errors into
     * `[ message, instancePath ]` entries.
     *
     * @param list<array{message?: string, instancePath?: string}> $details
     */
    private static function collectErrors(?OpisValidationError $error, array &$details): void
    {
        if ($error === null) {
            return;
        }

        $subErrors = $error->subErrors();

        if (count($subErrors) > 0) {
            foreach ($subErrors as $sub) {
                self::collectErrors($sub, $details);
            }

            return;
        }

        $path = $error->data()->fullPath();
        $instancePath = count($path) > 0 ? '/' . implode('/', $path) : '';

        $details[] = [
            'message' => $error->keyword(),
            'instancePath' => $instancePath,
        ];
    }
}
