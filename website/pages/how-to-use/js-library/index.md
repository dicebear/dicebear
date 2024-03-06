---
description: >
  Learn how to use the DiceBear JavaScript library in your project to create
  avatars. Works in the browser and in Node.js!
---

# JS-Library

The library is written in [TypeScript](https://www.typescriptlang.org/) /
[JavaScript](https://developer.mozilla.org/en-US/Web/JavaScript) and can be used
in the browser and also in [Node.js](https://nodejs.org/en/). In other
environments you may be interested in the [HTTP API](/how-to-use/http-api/) or
the [CLI](/how-to-use/cli/).

The library is a pure
[ESM package](https://developer.mozilla.org/en-US/Web/JavaScript/Guide/Modules).
[Sindre Sorhus](https://github.com/sindresorhus) has written a great
[help page](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
if you are new to ESM packages.

## Installation

At least two packages are needed. The first package is the core library
`@dicebear/core` and the second package is an avatar style. In our examples we
use the package `@dicebear/collection` which contains all official avatar
styles.

```
npm install @dicebear/core @dicebear/collection
```

::: tip

We highly recommend the use of a bundler with
[tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
functionality. If you don't have one, take a look at our guide
"[Using the library without tree shaking](/guides/use-the-library-without-tree-shaking/)".

:::

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const svg = avatar.toString();
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

We provide a large number of avatar styles from different designers. The designs
are licensed under different licenses that the designers can choose themselves.
For a quick overview we have created an [license overview](/licenses/) for you.

:::

## Methods

### `createAvatar(style, options)`

**Return type:** Object with [.toString()](#tostring), [.toJson()](#tojson),
[.toDataUri()](#todatauri), [.toFile(name)](#tofile),
[.toArrayBuffer()](#toarraybuffer), [.png(options)](#png) and
[.jpg(options)](#jpg) methods.

Every cool avatar starts here! An avatar style is expected as the first
argument. The second argument is an optional `object` with options. Which
options are possible here depends on the [avatar style](/styles/).

<!-- prettier-ignore -->
```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, { // [!code focus:3]
  // ... options
});
```

### `.toString()`

**Return type:** `string`

Returns the avatar as SVG in XML format.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const svg = avatar.toString(); // [!code focus]
```

### `.toJson()`

**Return type:** `{ svg: string, extra: Record<string, unknown> }`

Returns a JSON with the SVG and additional information, such as the actual
options used.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const json = avatar.toJson(); // [!code focus]
```

### `.toDataUri()`

**Return type:** `Promise<string>`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const dataUri = await avatar.toDataUri(); // [!code focus]
```

### `.toDataUriSync()`

**Return type:** `string`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).
Same as `.toDataUri()` but synchronous.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const dataUri = avatar.toDataUriSync(); // [!code focus]
```

### `.toFile(name)` {#tofile}

**Return type:** `Promise<void>`

In browsers, this method downloads the avatar, while in Node.js, the avatar is
saved to the file system.

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

await avatar.toFile('avatar.svg'); // [!code focus]
```

### `.toArrayBuffer()`

**Return type:** `Promise<ArrayBuffer>`

Converts the avatar to an
[ArrayBuffer](https://developer.mozilla.org/en-US/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const arrayBuffer = await avatar.toArrayBuffer(); // [!code focus]
```

### `.png(options)` {#png}

**Return type:** Object with [.toDataUri()](#todatauri),
[.toFile(name)](#tofile) and [.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to PNG. Expects an optional `options` argument of
type `object`. The following options can be passed:

- `includeExif`: If set to `true`, the PNG will contain license information in
  the metadata. By default `false`. Only works in Node.js.

<!-- prettier-ignore -->
```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const png = await avatar.png({ // [!code focus:3]
  // ... options
});

// The avatar can now be saved as a PNG, for example.
png.toFile('avatar.png');
```

:::warning Additional dependencies required!

In Node.js, additional packages need to be installed for this method:

```
npm install @resvg/resvg-js@^2.0.0 sharp@^0.30.4
```

The `includeExif` option requires an additional package:

```
npm install exiftool-vendored@^16.3.0
```

:::

### `.jpg(options)` {#jpg}

**Return type:** Object with [.toDataUri()](#todatauri),
[.toFile(name)](#tofile) and [.toArrayBuffer()](#toarraybuffer) methods.

Converts the avatar from SVG to JPEG. Expects an optional `options` argument of
type `object`. The following options can be passed:

- `includeExif`: If set to `true`, the JPEG will contain license information in
  the metadata. By default `false`. Only works in Node.js.

<!-- prettier-ignore -->
```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const jpg = await avatar.jpg({ // [!code focus:3]
  // ... options
});

// The avatar can now be saved as a JPEG, for example.
jpg.toFile('avatar.jpg');
```

:::warning Additional dependencies required!

In Node.js, additional packages need to be installed for this method:

```
npm install @resvg/resvg-js@^2.0.0 sharp@^0.30.4
```

The `includeExif` option requires an additional package:

```
npm install exiftool-vendored@^16.3.0
```

:::
