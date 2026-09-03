<?php

declare(strict_types=1);

namespace DiceBear;

/**
 * Top-level entry point for rendering an avatar from a style and options.
 *
 * Construction immediately resolves and renders the SVG; the various
 * accessor methods return different serializations of that result.
 */
class Avatar
{
    private string $svg;
    /** @var array<string, mixed> */
    private array $resolvedOptions;

    /**
     * Pass a {@see Style} instance and reuse it across avatars.
     *
     * @param array<string, mixed> $optionsInput
     */
    public function __construct(Style $style, array $optionsInput = [])
    {
        $options = new Options($optionsInput);
        $resolver = new Resolver($style, $options);

        $this->svg = (new Renderer($style, $resolver))->render();
        $this->resolvedOptions = $resolver->resolved();
    }

    public function __toString(): string
    {
        return $this->svg;
    }

    /**
     * Returns the rendered SVG markup.
     */
    public function toString(): string
    {
        return $this->svg;
    }

    /**
     * Returns the avatar as an associative array containing the SVG and the
     * fully resolved options used to render it.
     *
     * @return array<string, mixed>
     */
    public function toJSON(): array
    {
        return [
            'svg' => $this->svg,
            'options' => $this->resolvedOptions,
        ];
    }

    /**
     * Returns the SVG encoded as a `data:image/svg+xml` URI.
     *
     * Encodes exactly like JavaScript's `encodeURIComponent`: `rawurlencode`
     * additionally escapes `!*'()`, so those are reverted to stay byte-identical
     * with the other ports.
     */
    public function toDataUri(): string
    {
        $encoded = strtr(rawurlencode($this->svg), [
            '%21' => '!',
            '%2A' => '*',
            '%27' => "'",
            '%28' => '(',
            '%29' => ')',
        ]);

        return 'data:image/svg+xml;charset=utf-8,' . $encoded;
    }
}
