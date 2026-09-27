---
title: Dart Avatar Library
description: >
  Use the DiceBear Dart library to generate SVG profile pictures in Dart and
  Flutter. Dart 3.4+ with an API identical to the JavaScript library.
---

# Dart avatar library

Generate avatars in Dart (3.4 or higher) and in
[Flutter apps](/integrations/dart/flutter/), with no external service involved.

The API mirrors the [JavaScript library](/integrations/javascript/), and the
output is byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two packages: the core library `dicebear_core` and the avatar style
definitions `dicebear_styles`. Each style is a string constant in its own
library, so a compiled app only embeds the styles it imports.

```sh
dart pub add dicebear_core
dart pub add dicebear_styles
```

In a Flutter project, use `flutter pub add` instead.

## Usage

Each style is exposed as a raw-JSON string (e.g. `lorelei` from
`package:dicebear_styles/lorelei.dart`) that you hand to `Style.parse`:

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/lorelei.dart';

void main() {
  final style = Style.parse(lorelei);

  final avatar = Avatar(style, {
    'seed': 'John',
    // ... other options
  });

  print(avatar.svg);
}
```

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Types

- `Style` is a validated, immutable wrapper around a style definition.
  `Style.parse` decodes a raw JSON string, the default `Style(...)` constructor
  takes an already decoded `Map<String, Object?>`. Build it once and reuse it
  for every avatar of that style. Invalid definitions throw a
  `StyleValidationError`.
- `Avatar` renders one avatar from a `Style` and an optional map of options.
  Invalid options throw an `OptionsValidationError`, circular color references a
  `CircularColorReferenceError`.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `OptionsDescriptor(style).toJson()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                | Returns                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `svg` or `toString()` | The SVG as a `String`, so an `Avatar` works directly in string interpolation and `print`                     |
| `toJson()`            | A `Map<String, Object?>` with the SVG under `svg` and the resolved options under `options`, for `jsonEncode` |
| `resolvedOptions`     | The resolved options as a map                                                                                |
| `toDataUri()`         | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)                                       |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in Dart syntax:

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'flip': 'horizontal', // 'none', 'horizontal', 'vertical', 'both'
  'rotate': 10, // -360 to 360, or [min, max] range
  'scale': 0.9, // 0 to 10 (1 = original), or [min, max] range
  'borderRadius': 50, // 0-50 (50 = circle)
  'size': 128,
  'translateX': 0, // -1000 to 1000 (percent of canvas width)
  'translateY': 0, // -1000 to 1000 (percent of canvas height)
  'idRandomization': true,
  'title': 'User Avatar',
  'fontFamily': 'Arial', // or ['Arial', 'Helvetica']
  'fontWeight': 700, // 1-1000
  'backgroundColor': ['#b6e3f4', '#c0aede'],
  'backgroundColorFill': 'solid', // 'solid', 'linear', 'radial'
});
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

```dart
for (final seed in ['alice', 'bob', 'charlie']) {
  final avatar = Avatar(style, {
    'seed': seed,
    'idRandomization': true,
  });
  print(avatar.svg);
}
```

### Weighted variant selection

A weight map makes some variants more likely than others. Here lorelei picks
`happy01` or `happy02` mouths twice as often as `sad01`:

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'mouthVariant': {'happy01': 2, 'happy02': 2, 'sad01': 1},
});
```
