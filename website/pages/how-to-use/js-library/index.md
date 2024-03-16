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
[.toDataUri()](#todatauri) methods.

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

**Return type:** `string`

Returns the avatar as [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme).

```js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const avatar = createAvatar(lorelei, {
  // ... options
});

const dataUri = avatar.toDataUri(); // [!code focus]
```
