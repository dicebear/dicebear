<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (Dart)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

Dart implementation of the DiceBear avatar library. Generates deterministic SVG
avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/integrations/dart/)

## Installation

```sh
dart pub add dicebear_core
dart pub add dicebear_styles
```

`dicebear_core` is the engine; the avatar style definitions ship separately in
the pure-data [`dicebear_styles`](https://pub.dev/packages/dicebear_styles)
package.

Requires Dart 3.4 or newer.

## Usage

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/adventurer.dart';

void main() {
  // Each style ships as a raw JSON string; Style.parse decodes and validates it.
  final style = Style.parse(adventurer);

  final avatar = Avatar(style, {
    'seed': 'John Doe',
    'size': 128,
  });

  print(avatar.svg); // SVG string
  print(avatar.toDataUri()); // data:image/svg+xml;charset=utf-8,...
}
```

### Using the Style type

```dart
final style = Style.parse(adventurer);

// Create multiple avatars from the same style
final avatar1 = Avatar(style, {'seed': 'Alice'});
final avatar2 = Avatar(style, {'seed': 'Bob'});
```

If you already hold a decoded definition (a `Map<String, Object?>`, for example
one you built yourself or decoded with `jsonDecode`), pass it to the default
`Style(...)` constructor instead of `Style.parse`.

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
