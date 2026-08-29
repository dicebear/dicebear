---
title: Converter – Convert SVG Avatars to PNG, JPEG & More
description: >
  Learn how to use the DiceBear Converter library in your project to convert SVG
  to PNG or JPEG. Works in the browser and in Node.js!
---

# Converter

Sometimes you need the avatar in a different format than SVG. For this we have
created a package called `@dicebear/converter` which can convert the avatar to
PNG, JPEG, WebP, and AVIF.

## Installation

```
npm install @dicebear/converter
```

::: tip

You don't need to install the core library `@dicebear/core` to use the converter
package. While it is optimized for DiceBear, it can also be used with SVGs from
other sources.

:::

## Usage

Although the converter can be used without the core library, we use it in our
example to create the avatar.

```js
import { toPng } from '@dicebear/converter';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const avatar = new Avatar(style, {
  seed: 'Alice',
  // ... other options
});

const png = toPng(avatar);
const dataUri = await png.toDataUri();
```

## Supported formats

| Format | Function | Browser | Node.js | Notes                                 |
| ------ | -------- | ------- | ------- | ------------------------------------- |
| PNG    | `toPng`  | Yes     | Yes     | Full support                          |
| JPEG   | `toJpeg` | Yes     | Yes     | Full support                          |
| WebP   | `toWebp` | Yes\*   | Yes     | Unsupported browsers fall back to PNG |
| AVIF   | `toAvif` | Yes\*   | Yes     | Unsupported browsers fall back to PNG |

\* WebP is supported in all modern browsers. AVIF support varies; check
[caniuse.com](https://caniuse.com/avif) for current browser compatibility.

## Methods

### `toPng(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to PNG. Expects an SVG `string` or an `object` with
`toString` method as first argument. Expects an optional `options` argument of
type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});
```

### `toJpeg(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to JPEG. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toJpeg } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const jpeg = toJpeg(svg, {
  // ... options
});
```

### `toWebp(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to WebP. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toWebp } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const webp = toWebp(svg, {
  // ... options
});
```

::: warning Limited browser support

This function uses an HTML canvas element in the browser and is dependent on the
browser being able to export the canvas as WebP. If the browser does not support
WebP, PNG is used as a fallback. See
[MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
for browser compatibility.

:::

### `toAvif(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to AVIF. Expects an SVG `string` or an `object`
with `toString` method as first argument. Expects an optional `options` argument
of type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toAvif } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const avif = toAvif(svg, {
  // ... options
});
```

::: warning Limited browser support

This function uses an HTML canvas element in the browser and is dependent on the
browser being able to export the canvas as AVIF. If the browser does not support
AVIF, PNG is used as a fallback. See
[MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
for browser compatibility.

:::

### `.toDataUri()`

**Return type:** `Promise<string>`

Returns the image as a
[data URI](https://en.wikipedia.org/wiki/Data_URI_scheme). This is useful for
embedding the image directly in HTML or CSS.

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});
const dataUri = await png.toDataUri(); // [!code focus]

// Use in HTML: <img src={dataUri} alt="Avatar" />
```

### `.toArrayBuffer()`

**Return type:** `Promise<ArrayBuffer>`

Converts the image to an
[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
This is useful for saving files or sending binary data.

```js
import { toPng } from '@dicebear/converter';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});
const buffer = await png.toArrayBuffer(); // [!code focus]
```

## Options

| Option        | Type       | Default | Environment       | Description                               |
| ------------- | ---------- | ------- | ----------------- | ----------------------------------------- |
| `size`        | `number`   | `512`   | Browser + Node.js | Output image size in pixels (max: `2048`) |
| `fonts`       | `string[]` | `[]`    | Node.js           | Paths to custom font files                |
| `includeExif` | `boolean`  | `false` | Node.js           | Include metadata in output image          |

### size

**Type:** `number`

**Default:** `512`

**Maximum:** `2048`

Controls the width and height of the rasterized output image in pixels. The
output is always square. Values above `2048` are clamped to `2048`. Invalid
values (`NaN`, `<= 0`, `Infinity`) fall back to `512`.

```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  size: 128,
});
```

### fonts <Badge type="warning" text="Node.js only" />

**Type:** `string[]`

**Default:** `[]`

An array of paths to font files which should be used to render the avatar. If
not set, the system fonts will be used. This is particularly useful for the
[initials](/styles/initials/) style or other styles that render text.

```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  fonts: ['/path/to/custom-font.ttf'],
});
```

### includeExif <Badge type="warning" text="Node.js only" />

**Type:** `boolean`

**Default:** `false`

If set to `true`, the converter will try to read the metadata from the SVG and
add it to the output image as Exif metadata. This is useful for preserving
license and attribution information.

The converter extracts the avatar style title, source URL, creator name,
license, and copyright notice from the SVG and embeds them as Exif fields.

```js
import { toPng } from '@dicebear/converter';

const png = toPng(svg, {
  includeExif: true,
});
```

::: warning

This uses an `exiftool` singleton which needs to be exited manually when your
application terminates. See the
[exiftool-vendored documentation](https://www.npmjs.com/package/exiftool-vendored)
for more information.

```js
import { exiftool } from 'exiftool-vendored';

// When your application exits:
await exiftool.end();
```

:::

## Examples

### Convert DiceBear avatar to PNG

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const style = new Style(lorelei);

const avatar = new Avatar(style, {
  seed: 'Alice',
  backgroundColor: ['#b6e3f4'],
});

const png = toPng(avatar);
const dataUri = await png.toDataUri();

// Use in browser
document.querySelector('img').src = dataUri;
```

### Save avatar to file (Node.js)

```js
import { Style, Avatar } from '@dicebear/core';
import bottts from '@dicebear/styles/bottts.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';
import { writeFile } from 'node:fs/promises';

const style = new Style(bottts);

const avatar = new Avatar(style, {
  seed: 'robot-42',
});

const png = toPng(avatar);
const buffer = await png.toArrayBuffer();

await writeFile('avatar.png', Buffer.from(buffer));
```

### Convert with Exif metadata (Node.js)

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';
import { exiftool } from 'exiftool-vendored';
import { writeFile } from 'node:fs/promises';

const style = new Style(lorelei);

const avatar = new Avatar(style, {
  seed: 'Alice',
});

const png = toPng(avatar, {
  includeExif: true,
});

const buffer = await png.toArrayBuffer();
await writeFile('avatar.png', Buffer.from(buffer));

// Important: Close exiftool when done
await exiftool.end();
```

### Use with custom fonts (Node.js)

```js
import { Style, Avatar } from '@dicebear/core';
import initials from '@dicebear/styles/initials.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const style = new Style(initials);

const avatar = new Avatar(style, {
  seed: 'Alice',
});

const png = toPng(avatar, {
  fonts: ['/path/to/Roboto-Bold.ttf'],
});

const dataUri = await png.toDataUri();
```

### Convert with a custom size

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import { toPng } from '@dicebear/converter';

const style = new Style(lorelei);

const avatar = new Avatar(style, { seed: 'Alice' });

const png = toPng(avatar, { size: 128 });
const dataUri = await png.toDataUri();
```

### Convert any SVG (without DiceBear)

```js
import { toPng } from '@dicebear/converter';

const svg = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="red" />
  </svg>
`;

const png = toPng(svg);
const dataUri = await png.toDataUri();
```

## TypeScript

The library is fully typed:

```ts
import { toPng, toJpeg, toWebp, toAvif } from '@dicebear/converter';
import type { Options, Result } from '@dicebear/converter';

const options: Options = {
  includeExif: true,
};

const result: Result = toPng(svg, options);
const buffer: ArrayBuffer = await result.toArrayBuffer();
```

## Rendering with resvg yourself

`toPng` and the other conversion functions handle this for you. If you drive
[resvg](https://github.com/yisibl/resvg-js) directly instead, run the SVG
through `normalizeMaskType` first:

```js
import { normalizeMaskType } from '@dicebear/converter';

const svg = normalizeMaskType(avatar.toString());
```

resvg reads `mask-type` only as a presentation attribute, not from a `style`
declaration. Figma writes the declaration, so official avatar styles carry masks
that resvg would otherwise treat as the `luminance` default and render as fully
hidden. `normalizeMaskType` mirrors the value onto the attribute. If nothing
needs fixing, you get your input back unchanged. When a mask does need fixing,
the function re-emits the SVG from a parsed tree, so formatting details like
quote style may change, while the rendered image stays the same. Browsers honor
both forms, so this only matters when you rasterize.
