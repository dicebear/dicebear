---
title: Dart Avatar Library
description: >
  Use the DiceBear Dart library to generate SVG profile pictures in Dart and
  Flutter. Dart 3.4+ with an API identical to the JavaScript library.
---

# Dart avatar library

The Dart library provides an API identical to the
[JavaScript library](/how-to-use/js-library/). It requires Dart 3.4 or higher
and also works in Flutter apps. The same seed and style definition produce SVGs
byte-identical to the JavaScript reference.

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

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/). Each style is exposed as a raw-JSON string
(e.g. `lorelei` from `package:dicebear_styles/lorelei.dart`) that you hand to
`Style.parse`.

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

`Style.parse` decodes and validates the raw JSON string. If you already hold a
decoded definition (a `Map<String, Object?>`), pass it to the default
`Style(...)` constructor instead.

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

We provide a large number of avatar styles from different creators. The avatar
styles are licensed under different licenses that the creators can choose
themselves. For a quick overview we have created a
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
always produces the same avatar:

```dart
final avatar1 = Avatar(style, {'seed': 'user-123'});
final avatar2 = Avatar(style, {'seed': 'user-123'});

// avatar1.svg == avatar2.svg
```

## Types

### `Style`

A validated, immutable wrapper around a style definition. Build it once from the
decoded definition JSON, then reuse it when generating multiple avatars. Invalid
definitions throw a `StyleValidationError`.

```dart
final style = Style.parse(lorelei);

final avatar1 = Avatar(style, {'seed': 'Alice'});
final avatar2 = Avatar(style, {'seed': 'Bob'});
```

### `Avatar`

The main class for generating avatars. The constructor takes a `Style` and an
optional map of options (invalid options throw an `OptionsValidationError`,
circular color references a `CircularColorReferenceError`). Omitting the options
map is the same as passing an empty one.

```dart
final avatar = Avatar(style, {
  // ... options
});
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```dart
final descriptor = OptionsDescriptor(style).toJson();
```

## Methods

### `svg` / `toString()`

**Return type:** `String`

Returns the avatar as SVG in XML format. `toString()` returns the same string,
so an `Avatar` can be used directly in string contexts (string interpolation,
`print`).

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

var svg = avatar.svg;
// or
svg = avatar.toString();
```

### `toJson()`

**Return type:** `Map<String, Object?>` (with keys `svg` and `options`)

Returns the SVG and the resolved options as a JSON-encodable map. Pass it to
`jsonEncode` for the serialized form.

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

final result = jsonEncode(avatar.toJson());

// result → {"svg":"<svg>...</svg>","options":{"flip":"none",...}}
```

The resolved options are also available directly as a map via
`avatar.resolvedOptions`.

### `toDataUri()`

**Return type:** `String`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```dart
final avatar = Avatar(style, {'seed': 'Alice'});

final dataUri = avatar.toDataUri();

// <img src="{dataUri}" alt="Avatar" />
```

## Core options

The core options are identical to the JavaScript library. See the
[JS Library core options](/how-to-use/js-library/#core-options) for the full
reference. Here are the options in Dart syntax:

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

Dynamic component and color options also work the same way. See the
[JS Library documentation](/how-to-use/js-library/#dynamic-component-options)
for all available patterns.

## Examples

### Rendering in Flutter

The library has no Flutter dependency; it returns plain strings. To display an
avatar in a Flutter widget tree, render the SVG string with a package such as
[`flutter_svg`](https://pub.dev/packages/flutter_svg):

```dart
final avatar = Avatar(style, {'seed': 'Alice', 'size': 128});

// In your build method, with package:flutter_svg
SvgPicture.string(avatar.svg, width: 128, height: 128);
```

### Avatar with custom background

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'backgroundColor': ['#b6e3f4', '#c0aede', '#d1d4f9'],
});
```

### Fixed size avatar

```dart
import 'package:dicebear_styles/bottts.dart';

final style = Style.parse(bottts);

final avatar = Avatar(style, {
  'seed': 'robot-42',
  'size': 128,
  'borderRadius': 50, // circular avatar
});
```

### Avatar with transformations

```dart
import 'package:dicebear_styles/avataaars.dart';

final style = Style.parse(avataaars);

final avatar = Avatar(style, {
  'seed': 'Jane',
  'flip': 'horizontal',
  'rotate': 10,
  'scale': 0.9,
  'translateY': 5,
});
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```dart
final style = Style.parse(lorelei);

for (final seed in ['alice', 'bob', 'charlie']) {
  final avatar = Avatar(style, {
    'seed': seed,
    'idRandomization': true,
  });
  print(avatar.svg);
}
```

### Weighted variant selection

A weighted map makes some variants more likely than others. The lorelei style
selects `happy01` or `happy02` mouths twice as often as `sad01` here:

```dart
final avatar = Avatar(style, {
  'seed': 'Alice',
  'mouthVariant': {'happy01': 2, 'happy02': 2, 'sad01': 1},
});
```
