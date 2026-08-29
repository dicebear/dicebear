---
title: JavaScript Avatar Library – Browser & Node.js
description: >
  Use the DiceBear JavaScript avatar library to generate SVG profile pictures in
  the browser (vanilla JS), React, Vue, Angular, Svelte, and Node.js. TypeScript
  support included.
---

# JavaScript avatar library

Generate avatars right where you need them: in the browser, in
[Node.js](https://nodejs.org/en/) (version 22 or higher), or at build time.
The library is written in [TypeScript](https://www.typescriptlang.org/), and
it renders the same avatar for the same seed as every other DiceBear
integration, so you can start here and change your mind later. Working in a
different language? [Pick your integration](/start/pick-your-integration/)
lists them all.

## Installation

You need two packages: the core library `@dicebear/core` and the avatar style
definitions `@dicebear/styles`.

```
npm install @dicebear/core @dicebear/styles
```

::: tip

Both packages are pure
[ESM](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules). If
your tooling complains about `require()`, [Sindre Sorhus](https://github.com/sindresorhus)
wrote a helpful [guide to ESM packages](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

:::

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
for [Angular](/integrations/javascript/angular/),
[React](/integrations/javascript/react/),
[React Native](/integrations/javascript/react-native/),
[Vue](/integrations/javascript/vue/) or
[Svelte](/integrations/javascript/svelte/).

:::

:::info

The avatar styles come from many creators, and each creator chooses the
license for their own style. The [license overview](/licenses/) lists them
all in one place.

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
[Access Style Options](/customize/style-options/) for details.

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

## Options

Every DiceBear core understands the same options. The full reference, including
the background, per-component, and per-color options, lives on the
[Core options](/customize/options/) page. The examples below show how to pass
them in JavaScript.

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
[Converter](/integrations/javascript/converter/) package.
