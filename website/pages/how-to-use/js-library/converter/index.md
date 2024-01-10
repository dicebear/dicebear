---
description: >
  Learn how to use the DiceBear JavaScript library in your project to create
  avatars. Works in the browser and in Node.js!
---

# Converter

Sometimes you need the avatar in a different format than SVG. For this we have
created a package called `@dicebear/convert` which can convert the avatar to PNG
and JPEG which can be used in the browser and also in
[Node.js](https://nodejs.org/en/).

## Installation

```
npm install @dicebear/convert
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
import { toPng } from '@dicebear/convert';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const svg = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const png = toPng(avatar, {
  // ... options
});
```

## Methods

### `toPng(svg, options)`

**Return type:** Object with [.toDataUri()](#todatauri) and
[.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to PNG. Expects an SVG `string` or an `object` with
`toString` method as first argument. Expects an optional `options` argument of
type `object`. See [options](#options) for more information.

<!-- prettier-ignore -->
```js
import { toJpeg } from '@dicebear/convert';

const svg = '<svg>...</svg>';

const png = toJpeg(svg, {
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
import { toJpeg } from '@dicebear/convert';

const svg = '<svg>...</svg>';

const jpeg = toJpeg(svg, {
  // ... options
});
```

### `.toDataUri()`

**Return type:** `Promise<string>`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).

```js
import { toPng } from '@dicebear/convert';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});

const dataUri = await png.toDataUri(); // [!code focus]
```

### `.toArrayBuffer()`

**Return type:** `Promise<ArrayBuffer>`

Converts the avatar to an
[ArrayBuffer](https://developer.mozilla.org/en-US/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

```js
import { toPng } from '@dicebear/convert';

const svg = '<svg>...</svg>';

const png = toPng(svg, {
  // ... options
});

const dataUri = await png.toArrayBuffer(); // [!code focus]
```

## Options

### fonts <Badge type="warning" text="Node.js only" />

**Type:** `string[]`

**Default:** `[]`

An array of paths to font files which should be used to render the avatar. If
not set, the system fonts will be used.

### includeExif <Badge type="warning" text="Node.js only" />

**Type:** `boolean`

**Default:** `false`

If set to `true`, the converter will try to read the metadata from the SVG and
add it to the PNG or JPEG. This is useful if you want to add license information
to the image.

::: warning

This uses an `exiftool` singleton which needs to be exited manually. See the
[documentation](https://www.npmjs.com/package/exiftool-vendored#usage) for more
information.

:::
