<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (JavaScript)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

JavaScript implementation of the DiceBear avatar library. Generates
deterministic SVG avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/integrations/javascript/)

## Installation

```sh
npm install @dicebear/core
```

Requires Node.js 22+ or any modern browser.

## Usage

```js
import { Avatar, Style } from '@dicebear/core';

// From a style definition (here from the @dicebear/styles package)
import definition from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(new Style(definition), {
  seed: 'John',
  size: 128,
});

avatar.toString(); // SVG string
avatar.toDataUri(); // data:image/svg+xml;charset=utf-8,...
```

### Using the Style class

```js
import { Style, Avatar } from '@dicebear/core';

const style = new Style(definition);

// Create multiple avatars from the same style
const avatar1 = new Avatar(style, { seed: 'Alice' });
const avatar2 = new Avatar(style, { seed: 'Bob' });
```

## Smaller bundle without validation

About half of the package is the two schema validators. `@dicebear/core/lite`
exports the same API without them, about 14 kB instead of 30 kB gzipped.

> **Warning:** The validation is what keeps unsafe content such as scripts,
> event handlers and external references out of the SVG, and what turns a wrong
> option into an error instead of odd output. The lite entry renders whatever it
> gets. Use it only for definitions and options you wrote or generated yourself,
> never for anything from an upload, a URL or another source you do not control.

```js
import { Style, Avatar } from '@dicebear/core/lite';
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
