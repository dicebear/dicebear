---
title: PHP Avatar Library
description: >
  Use the DiceBear PHP library to generate SVG profile pictures on the server.
  PHP 8.2+ with an API identical to the JavaScript library.
---

# PHP avatar library

Generate avatars on your own server, in plain PHP (8.2 or higher), with no
external service involved. The API mirrors the
[JavaScript library](/integrations/javascript/), and the output is
byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two packages: the core library `dicebear/core` and the avatar style
definitions `dicebear/styles`.

```
composer require dicebear/core dicebear/styles
```

## Usage

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/lorelei.json'));

$avatar = new Avatar($style, [
  'seed' => 'Alice',
  // ... other options
]);

$svg = (string) $avatar;
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the
license for their own style. The [license overview](/licenses/) lists them
all in one place.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
will always produce the same avatar:

```php
$avatar1 = new Avatar($style, ['seed' => 'user-123']);
$avatar2 = new Avatar($style, ['seed' => 'user-123']);

(string) $avatar1 === (string) $avatar2; // true
```

## Classes

### `Avatar`

The main class for generating avatars. Pass a `Style` instance and optional
options.

```php
use DiceBear\Avatar;

$avatar = new Avatar($style, [
  // ... options
]);
```

### `Style`

An immutable wrapper around a style definition. Reuse it when generating
multiple avatars from the same style.

```php
use DiceBear\Style;
use DiceBear\Avatar;

$style = new Style($definition);

$avatar1 = new Avatar($style, ['seed' => 'Alice']);
$avatar2 = new Avatar($style, ['seed' => 'Bob']);
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```php
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$descriptor = new OptionsDescriptor(new Style($definition));
$fields = $descriptor->toJSON();
```

## Methods

### `__toString()` / `toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format. The `__toString()` magic method allows
using the avatar directly in string contexts.

```php
$avatar = new Avatar($style, ['seed' => 'Alice']);

$svg = (string) $avatar;
// or
$svg = $avatar->toString();
```

### `toJSON()`

**Return type:** `array{svg: string, options: array}`

Returns an associative array with the SVG and the resolved options.

```php
$avatar = new Avatar($style, ['seed' => 'Alice']);

$json = $avatar->toJSON();

// $json['svg']     → '<svg>...</svg>'
// $json['options'] → ['seed' => 'Alice', ...]
```

### `toDataUri()`

**Return type:** `string`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```php
$avatar = new Avatar($style, ['seed' => 'Alice']);

$dataUri = $avatar->toDataUri();

// <img src="<?= $dataUri ?>" alt="Avatar" />
```

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the
options in PHP syntax:

```php
$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'flip' => 'horizontal',          // 'none', 'horizontal', 'vertical', 'both'
  'rotate' => 10,                  // -360 to 360, or [min, max] range
  'scale' => 0.9,                  // 0 to 10 (1 = original), or [min, max] range
  'borderRadius' => 50,            // 0-50 (50 = circle)
  'size' => 128,
  'translateX' => 0,               // -1000 to 1000 (percent of canvas width)
  'translateY' => 0,               // -1000 to 1000 (percent of canvas height)
  'idRandomization' => true,
  'title' => 'User Avatar',
  'fontFamily' => 'Arial',         // or ['Arial', 'Helvetica']
  'fontWeight' => 700,             // 1-1000
  'backgroundColor' => ['#b6e3f4', '#c0aede'],
  'backgroundColorFill' => 'solid', // 'solid', 'linear', 'radial'
]);
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Avatar with custom background

```php
$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'backgroundColor' => ['#b6e3f4', '#c0aede', '#d1d4f9'],
]);
```

### Fixed size avatar

```php
$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/bottts.json'));

$avatar = new Avatar($style, [
  'seed' => 'robot-42',
  'size' => 128,
  'borderRadius' => 50, // circular avatar
]);
```

### Avatar with transformations

```php
$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/avataaars.json'));

$avatar = new Avatar($style, [
  'seed' => 'Jane',
  'flip' => 'horizontal',
  'rotate' => 10,
  'scale' => 0.9,
  'translateY' => 5,
]);
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```php
$users = ['alice', 'bob', 'charlie'];

$avatars = array_map(function (string $user) use ($style) {
  return (string) new Avatar($style, [
    'seed' => $user,
    'idRandomization' => true,
  ]);
}, $users);
```

### Weighted variant selection

```php
$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'topVariant' => ['short01' => 2, 'short02' => 2, 'long01' => 1],
]);
```
