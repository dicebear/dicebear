<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Converter</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

Converts DiceBear avatars (or any SVG) to raster formats: PNG, JPEG, WebP and
AVIF. Works in Node.js and modern browsers.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/start/what-is-dicebear/)

## Installation

```sh
npm install @dicebear/converter
```

Requires Node.js 22+ or any modern browser.

## Usage

```js
import { Avatar, Style } from '@dicebear/core';
import { toPng } from '@dicebear/converter';

// From a style definition (here from the @dicebear/styles package)
import definition from '@dicebear/styles/lorelei.json' with { type: 'json' };

const avatar = new Avatar(new Style(definition), { seed: 'John' });

const png = toPng(avatar, { size: 256 });

await png.toDataUri(); // data:image/png;base64,...
await png.toArrayBuffer(); // ArrayBuffer
```

`toJpeg`, `toWebp` and `toAvif` work the same way. Each function also accepts a
raw SVG string instead of an `Avatar`.

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
