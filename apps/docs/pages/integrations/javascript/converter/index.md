---
title: Converter – Convert SVG Avatars to PNG, JPEG & More
description: >
  Learn how to use the DiceBear Converter library in your project to convert SVG
  to PNG or JPEG. Works in the browser and in Node.js!
---

# Converter

`@dicebear/converter` turns an avatar into PNG, JPEG, WebP, or AVIF, in the
browser and in Node.js.

## Installation

```sh
npm install @dicebear/converter
```

The converter doesn't need `@dicebear/core`. It's optimized for DiceBear, but it
converts SVGs from other sources too.

## Usage

```js
import { toPng } from '@dicebear/converter';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, { seed: 'Alice' });

const png = toPng(avatar, { size: 128 });

const dataUri = await png.toDataUri(); // for an <img> source or CSS
const buffer = await png.toArrayBuffer(); // for files or binary data
```

In Node.js, write the buffer to a file:

```js
import { writeFile } from 'node:fs/promises';

await writeFile('avatar.png', Buffer.from(buffer));
```

## Functions

| Function                | Format | Browser | Node.js |
| ----------------------- | ------ | ------- | ------- |
| `toPng(svg, options?)`  | PNG    | Yes     | Yes     |
| `toJpeg(svg, options?)` | JPEG   | Yes     | Yes     |
| `toWebp(svg, options?)` | WebP   | Yes\*   | Yes     |
| `toAvif(svg, options?)` | AVIF   | Yes\*   | Yes     |

Each function takes an SVG string or an object with a `toString()` method, such
as an `Avatar`. The result has two methods: `toDataUri()` resolves to a
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme), and `toArrayBuffer()`
to an
[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

\* In the browser the conversion runs through an HTML canvas, so WebP and AVIF
depend on the browser being able to export them. Where it can't, you get PNG.
WebP works in all modern browsers, AVIF support varies. See
[caniuse.com](https://caniuse.com/avif) and
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
for details.

## Options

| Option        | Type       | Default | Environment       | Description                                                                                                                                                           |
| ------------- | ---------- | ------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`        | `number`   | `512`   | Browser + Node.js | Width and height of the square output in pixels. Values above `2048` are clamped to `2048`, invalid values (`NaN`, `<= 0`, `Infinity`) fall back to `512`             |
| `fonts`       | `string[]` | `[]`    | Node.js           | Paths to font files for styles that render text, such as [initials](/styles/initials/). Without it, the system fonts are used                                         |
| `includeExif` | `boolean`  | `false` | Node.js           | Copies the style title, source URL, creator, license, and copyright notice from the SVG into Exif fields, so license and attribution information stays with the image |

::: warning

`includeExif` uses an `exiftool` singleton that you have to end when your
application exits. See the
[exiftool-vendored documentation](https://www.npmjs.com/package/exiftool-vendored)
for more information.

```js
import { exiftool } from 'exiftool-vendored';

// When your application exits:
await exiftool.end();
```

:::

The package is fully typed and exports the `Options` and `Result` types.

## Rendering with resvg yourself

`toPng` and the other functions handle this for you. If you drive
[resvg](https://github.com/yisibl/resvg-js) directly instead, run the SVG
through `normalizeMaskType` first:

```js
import { normalizeMaskType } from '@dicebear/converter';

const svg = normalizeMaskType(avatar.toString());
```

resvg reads `mask-type` only as a presentation attribute, not from a `style`
declaration. Figma writes the declaration, so official avatar styles carry masks
that resvg would treat as the `luminance` default and render as fully hidden.
`normalizeMaskType` mirrors the value onto the attribute. If nothing needs
fixing, you get your input back unchanged. Otherwise the function re-emits the
SVG from a parsed tree, so formatting details like quote style may change, while
the rendered image stays the same. Browsers honor both forms, so this only
matters when you rasterize.
