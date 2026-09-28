---
title: PHP Avatar Library
description: >
  Use the DiceBear PHP library to generate SVG profile pictures on the server.
  PHP 8.2+ with an API identical to the JavaScript library.
---

# PHP avatar library

Generate avatars on your own server, in plain PHP (8.2 or higher), with no
external service involved.

The API mirrors the [JavaScript library](/integrations/javascript/), and the
output is byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two packages: the core library `dicebear/core` and the avatar style
definitions `dicebear/styles`.

```sh
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

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Classes

- `Style` is an immutable wrapper around a style definition. `Style::fromJson()`
  reads a JSON string, `new Style($definition)` takes the decoded definition.
  Build it once and reuse it for every avatar of that style.
- `Avatar` renders one avatar from a `Style` and an optional array of options.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `(new OptionsDescriptor($style))->toJSON()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                             | Returns                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `toString()` or `(string) $avatar` | The SVG as a `string`                                                      |
| `toJSON()`                         | `array{svg: string, options: array}` with the SVG and the resolved options |
| `toDataUri()`                      | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)     |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in PHP syntax:

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

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

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

A weight map makes some variants more likely than others. Here one in five
[critters](/styles/critters/) has a single eye:

```php
$style = Style::fromJson(file_get_contents($basePath . '/src/critters.json'));

$avatar = new Avatar($style, [
  'seed' => 'Alice',
  'eyesVariant' => ['round' => 4, 'mono' => 1],
]);
```
