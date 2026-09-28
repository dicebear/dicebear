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

The library is written in [TypeScript](https://www.typescriptlang.org/), and it
renders the same avatar for the same seed as every other DiceBear integration,
so you can start here and change your mind later. Working in a different
language? [Pick your integration](/start/pick-your-integration/) lists them all.

## Installation

You need two packages: the core library `@dicebear/core` and the avatar style
definitions `@dicebear/styles`.

```sh
npm install @dicebear/core @dicebear/styles
```

::: tip

Both packages are pure
[ESM](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules). If your
tooling complains about `require()`,
[Sindre Sorhus](https://github.com/sindresorhus) wrote a helpful
[guide to ESM packages](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

:::

## Usage

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

Every style has its own options, listed on its [style page](/styles/). For
frameworks, there are guides for [Angular](/integrations/javascript/angular/),
[React](/integrations/javascript/react/),
[React Native](/integrations/javascript/react-native/),
[Vue](/integrations/javascript/vue/), and
[Svelte](/integrations/javascript/svelte/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Classes

- `Style` is an immutable wrapper around a style definition. Create it once and
  reuse it for every avatar of that style.
- `Avatar` renders one avatar from a `Style` and optional options.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input. See [Style options](/customize/style-options/).

## Methods

| Method        | Returns                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `toString()`  | The SVG as a `string`                                                                                   |
| `toJSON()`    | `{ svg: string, options: StyleOptions }` with the SVG and the resolved options                          |
| `toDataUri()` | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme), for an `<img>` source or in CSS |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here they are in
JavaScript:

```js
const avatar = new Avatar(style, {
  seed: 'Alice',
  flip: 'horizontal', // 'none', 'horizontal', 'vertical', 'both'
  rotate: 10, // -360 to 360, or [min, max] range
  scale: 0.9, // 0 to 10 (1 = original), or [min, max] range
  borderRadius: 50, // 0-50 (50 = circle)
  size: 128,
  translateX: 0, // -1000 to 1000 (percent of canvas width)
  translateY: 0, // -1000 to 1000 (percent of canvas height)
  idRandomization: true,
  title: 'User Avatar',
  fontFamily: 'Arial', // or ['Arial', 'Helvetica']
  fontWeight: 700, // 1-1000
  backgroundColor: ['#b6e3f4', '#c0aede'],
  backgroundColorFill: 'solid', // 'solid', 'linear', 'radial'
});
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Multiple avatars on the same page

When you inline several SVGs into one document, rather than loading them through
`<img>`, their internal IDs can collide. `idRandomization` adds a random suffix
to every ID:

```js
const avatars = ['alice', 'bob', 'charlie'].map((seed) =>
  new Avatar(style, { seed, idRandomization: true }).toString(),
);
```

The suffix comes from `Math.random()`, not from the seed, so the markup is no
longer deterministic, only the image is. Leave the option off for snapshot
tests, SSR with hydration, and anywhere else that depends on identical markup.
Avatars loaded through `<img>`, as a data URI or from the HTTP API, don't need
it.

### Weighted variant selection

A weight map makes some variants more likely than others. Variants missing from
the map are left out. Here one in five [critters](/styles/critters/) has a
single eye:

```js
import critters from '@dicebear/styles/critters.json' with { type: 'json' };

const style = new Style(critters);
const avatar = new Avatar(style, {
  seed: 'John',
  eyesVariant: { round: 4, mono: 1 },
});
```

A weight of `0` leaves a variant out as well, unless every variant in the map
has weight `0`. The pick then falls back to all of them with equal chance.

## Accessibility

By default the generated `<svg>` element is `aria-hidden="true"`, so assistive
technology skips it. That's right for a decorative avatar next to a username.

When the avatar stands for a person on its own, for example as the only content
of a link, set the `title` option. The SVG then carries `role="img"`, an
`aria-label`, and a `<title>` element, so screen readers announce it:

```js
const avatar = new Avatar(style, {
  seed: 'Alice',
  title: 'Avatar for Alice',
});
```

If you embed the SVG through an `<img>` (via `toDataUri()`), use the `alt`
attribute instead. Assistive technology doesn't read the SVG's `<title>` inside
an image.

## Bundle size

About half of `@dicebear/core` is the two schema validators that check a style
definition and the render options. `@dicebear/core/lite` exports the same API
without them, which brings the library from about 30 kB down to about 14 kB
gzipped:

```js
import { Style, Avatar } from '@dicebear/core/lite';
```

::: warning The lite entry trusts what it gets

The schema validation is what keeps unsafe content out of the SVG: scripts,
event handlers, external references and elements the renderer cannot handle. The
lite entry renders a definition that the schema would reject, so a definition
from an upload, a URL or any other source you do not control can put such
content into your page. Wrong options are not reported either. They change the
output quietly or fail somewhere inside the renderer instead of raising a
validation error.

Use `@dicebear/core/lite` only for definitions and options that you wrote or
generated yourself. When in doubt, stay on `@dicebear/core`.

:::

## TypeScript

The library is fully typed. When you import a style definition as JSON,
TypeScript infers its literal types and autocompletes the component and color
option names:

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

## Convert to other formats

Need PNG, JPEG, or other formats? Check out the
[Converter](/integrations/javascript/converter/) package.
