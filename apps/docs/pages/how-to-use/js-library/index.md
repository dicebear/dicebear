---
title: JavaScript Avatar Library – Browser & Node.js
description: >
  Use the DiceBear JavaScript avatar library to generate SVG profile pictures in
  the browser (vanilla JS), React, Vue, Angular, Svelte, and Node.js. TypeScript
  support included.
---

# JavaScript avatar library

The library is written in [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) and can be used
in the browser and also in [Node.js](https://nodejs.org/en/) (version 22 or
higher). In other environments you may be interested in the
[PHP Library](/how-to-use/php-library/), the
[Python Library](/how-to-use/python-library/), the
[Rust Library](/how-to-use/rust-library/), the
[Go Library](/how-to-use/go-library/), the
[Dart Library](/how-to-use/dart-library/), the [HTTP API](/how-to-use/http-api/)
or the [CLI](/how-to-use/cli/).

The library is a pure
[ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules).
[Sindre Sorhus](https://github.com/sindresorhus) has written a great
[help page](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
if you are new to ESM packages.

## Installation

You need two packages: the core library `@dicebear/core` and the avatar style
definitions `@dicebear/styles`.

```
npm install @dicebear/core @dicebear/styles
```

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... other options
});

const svg = avatar.toString();
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

::: tip

If you'd like to integrate the library into a framework, check out our guides
for [Angular](/guides/use-the-library-with-angular/),
[React](/guides/use-the-library-with-react/),
[React Native](/guides/use-the-library-with-react-native/),
[Vue](/guides/use-the-library-with-vue/) or
[Svelte](/guides/use-the-library-with-svelte/).

:::

:::info

We provide a large number of avatar styles from different creators. The avatar
styles are licensed under different licenses that the creators can choose
themselves. For a quick overview we have created a
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
will always produce the same avatar, which is useful for user profiles:

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

// These will always produce the same avatar
const avatar1 = new Avatar(style, { seed: 'user-123' });
const avatar2 = new Avatar(style, { seed: 'user-123' });

avatar1.toString() === avatar2.toString(); // true
```

## Classes

### `Avatar`

The main class for generating avatars. Pass a `Style` instance and optional
options.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  // [!code focus:3]
  // ... options
});
```

### `Style`

An immutable wrapper around a style definition.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei); // [!code focus:4]

const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input. See
[Access Style Options](/guides/access-all-available-options/) for details.

## Methods

### `.toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  // ... options
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJSON()`

**Return type:** `{ svg: string, options: StyleOptions }`

Returns an object with the SVG and the resolved options that were used to
generate the avatar.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... other options
});

const json = avatar.toJSON(); // [!code focus]

// Example output:
// {
//   svg: '<svg>...</svg>',
//   options: {
//     seed: 'John',
//     // ... resolved options
//   }
// }
```

### `.toDataUri()`

**Return type:** `string`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).
This is useful for embedding the avatar directly in HTML or CSS.

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  // ... other options
});

const dataUri = avatar.toDataUri(); // [!code focus]

// Use in HTML
// <img src={dataUri} alt="Avatar" />
```

## Core options

These options are available for all avatar styles. Where the type lists
`[min, max]`, you may pass either a fixed value or a two-element tuple. The PRNG
samples a value from the tuple's range.

| Option            | Type                                             | Default       | Description                                                                   |
| ----------------- | ------------------------------------------------ | ------------- | ----------------------------------------------------------------------------- |
| `seed`            | `string`                                         | `''`          | Seed for deterministic generation                                             |
| `flip`            | `'none' \| 'horizontal' \| 'vertical' \| 'both'` | `'none'`      | Flip the avatar (accepts an array of values to randomize)                     |
| `rotate`          | `number \| [min, max]`                           | `0`           | Rotation in degrees (−360 to 360)                                             |
| `scale`           | `number \| [min, max]`                           | `1`           | Uniform scale factor around the canvas center (0 to 10; `1` is original size) |
| `borderRadius`    | `number \| [min, max]`                           | `0`           | Border radius in percent of the canvas (0 to 50; `50` makes a circle)         |
| `size`            | `integer`                                        | _unset_       | Output size in pixels (1 to 4096); when unset the SVG scales to its container |
| `translateX`      | `number \| [min, max]`                           | `0`           | Horizontal translation in percent of the canvas width (−1000 to 1000)         |
| `translateY`      | `number \| [min, max]`                           | `0`           | Vertical translation in percent of the canvas height (−1000 to 1000)          |
| `idRandomization` | `boolean`                                        | `false`       | Suffix every SVG `id` with a random non-deterministic value (see below)       |
| `title`           | `string`                                         | _unset_       | Accessible title; when set, the SVG becomes `role="img"` with `<title>`       |
| `fontFamily`      | `string \| string[]`                             | `'system-ui'` | Font family for text-based styles (CSS-style font stack, no quotes)           |
| `fontWeight`      | `integer \| integer[]`                           | `400`         | Font weight for text-based styles (1 to 1000)                                 |

### Background options

These options are available for every style, even ones that don't declare a
`background` color group in their definition.

| Option                     | Type                              | Default   | Description                                                        |
| -------------------------- | --------------------------------- | --------- | ------------------------------------------------------------------ |
| `backgroundColor`          | `string \| string[]`              | _unset_   | Background colors as hex (`#` optional, `#RGB` to `#RRGGBBAA`)     |
| `backgroundColorFill`      | `'solid' \| 'linear' \| 'radial'` | `'solid'` | Background fill type (accepts an array of values to randomize)     |
| `backgroundColorFillStops` | `integer \| [min, max]`           | `2`       | Number of gradient stops (minimum 2); ignored when fill is `solid` |
| `backgroundColorAngle`     | `number \| [min, max]`            | `0`       | Gradient angle in degrees (−360 to 360)                            |

### Dynamic component options

For each component in a style (e.g. `eyes`, `mouth`, `hair`), the following
options are available:

| Pattern                  | Type                                           | Description                                            |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------ |
| `{component}Variant`     | `string \| string[] \| Record<string, number>` | Restrict to specific variants, optionally with weights |
| `{component}Probability` | `number`                                       | Visibility probability in percent (0 to 100)           |

A component's rotation, translation, and scale are sampled at render time from
the component definition and are **not** user options: there are no
`{component}Rotate`, `{component}TranslateX`, `{component}TranslateY`, or
`{component}Scale` options.

Component aliases (declared via `extends` in the style definition) do not expose
their own option keys. They share `{source}Variant` and `{source}Probability`
with the component they extend.

### Dynamic color options

For each color group in a style (e.g. `skin`, `hair`) and `background`, the
following options are available:

| Pattern                 | Type                              | Description                                                        |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `{color}Color`          | `string \| string[]`              | Override the palette with hex values (`#` optional)                |
| `{color}ColorFill`      | `'solid' \| 'linear' \| 'radial'` | Fill type (accepts an array of values to randomize)                |
| `{color}ColorFillStops` | `integer \| [min, max]`           | Number of gradient stops (minimum 2); ignored when fill is `solid` |
| `{color}ColorAngle`     | `number \| [min, max]`            | Gradient angle in degrees (−360 to 360)                            |

## Examples

### Avatar with custom background

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  backgroundColor: ['#b6e3f4', '#c0aede', '#d1d4f9'],
  // ... other options
});
```

### Fixed size avatar

```js
import { Style, Avatar } from '@dicebear/core';
import bottts from '@dicebear/styles/bottts.json' with { type: 'json' };

const style = new Style(bottts);
const avatar = new Avatar(style, {
  seed: 'robot-42',
  size: 128,
  borderRadius: 50, // circular avatar
  // ... other options
});
```

### Avatar with transformations

```js
import { Style, Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const style = new Style(avataaars);
const avatar = new Avatar(style, {
  seed: 'Jane',
  flip: 'horizontal',
  rotate: 10,
  scale: 0.9,
  translateY: 5,
  // ... other options
});
```

### Multiple avatars on the same page

When inlining multiple avatars into the same document (e.g. dropping the SVG
markup into the page rather than using `<img src={dataUri}>`), use
`idRandomization` to suffix each SVG's internal IDs and avoid `<defs>` /
`url(#…)` collisions:

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const users = ['alice', 'bob', 'charlie'];

const avatars = users.map((user) =>
  new Avatar(style, {
    seed: user,
    idRandomization: true,
    // ... other options
  }).toString(),
);
```

The suffix is drawn from `Math.random()` (**not** from the DiceBear PRNG), so
two avatars rendered with the same seed get different IDs. This also means the
rendered SVG is no longer deterministic; only the visual output is. Skip
`idRandomization` for snapshot tests, SSR/hydration, or anywhere you depend on
identical markup. When you only embed avatars via `<img>` (data URI or HTTP API)
the IDs live inside isolated documents and ID randomization is unnecessary.

### Weighted variant selection

You can influence the PRNG to prefer certain variants by passing a weight map.
Variants not listed in the map are excluded; weights of `0` exclude that variant
unless **every** mapped variant has weight `0`, in which case the PRNG falls
back to an unweighted pick across them:

```js
import { Style, Avatar } from '@dicebear/core';
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' };

const style = new Style(avataaars);
const avatar = new Avatar(style, {
  seed: 'John',
  topVariant: { short01: 2, short02: 2, long01: 1 },
  // ... other options
});
```

## Accessibility

By default the generated `<svg>` element is `aria-hidden="true"`, so assistive
technology skips it. This is the right default for purely decorative avatars
next to a username.

When the avatar conveys identity on its own (e.g. it is the only thing in a
link, or has no visible label), set the `title` option. The renderer emits
`role="img" aria-label="…"` on the root element **and** a `<title>` child, so
screen readers announce the value:

```js
const avatar = new Avatar(style, {
  seed: 'Alice',
  title: 'Avatar for Alice',
});
```

If you embed the SVG inside an `<img>` (via `toDataUri()`), use the `<img>`
element's `alt` attribute instead. The SVG's internal `title` is not read by
assistive technology when the SVG is loaded as an image.

## TypeScript

The library is fully typed. You can import types for better IDE support:

```ts
import { Avatar, Style } from '@dicebear/core';
import type { StyleOptions, StyleDefinition } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, {
  seed: 'John',
  backgroundColor: ['#b6e3f4'],
  // ... other options
});
```

When importing a style definition as JSON, TypeScript infers the literal types
of the definition, providing autocomplete for component and color option names.

## Convert to other formats

Need PNG, JPEG, or other formats? Check out the
[Converter](/how-to-use/js-library/converter/) package.
