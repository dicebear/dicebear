<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (PHP)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

PHP implementation of the DiceBear avatar library. Generates deterministic SVG
avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/how-to-use/php-library/)

## Installation

```sh
composer require dicebear/core
```

Requires PHP 8.2+ and the `mbstring` extension.

## Usage

```php
use DiceBear\Avatar;

// From a style definition (JSON-decoded array)
$definition = json_decode(file_get_contents('path/to/style.json'), true);

$avatar = new Avatar($definition, [
    'seed' => 'John Doe',
    'size' => 128,
]);

echo $avatar;              // SVG string
echo $avatar->toDataUri(); // data:image/svg+xml;charset=utf-8,...
```

### Using the Style class

```php
use DiceBear\Style;
use DiceBear\Avatar;

$style = new Style($definition);

// Create multiple avatars from the same style
$avatar1 = new Avatar($style, ['seed' => 'Alice']);
$avatar2 = new Avatar($style, ['seed' => 'Bob']);
```

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or
discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
