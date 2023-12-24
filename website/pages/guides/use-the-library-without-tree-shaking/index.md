# Use the library without tree shaking

The examples in this documentation assume that you are using a bundler with a
[tree shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
function (Officially supported are [webpack](https://webpack.js.org/) and
[rollup](https://rollupjs.org/guide/en/)). If you don't use such a bundler, you
should not use the package `@dicebear/collection`, because it contains all
official avatar styles, which would bloat your frontend.

Instead, you should use the packages for the individual avatar styles. For
example, if you want to use the avatar style `lorelei`, you should install the
package `@dicebear/lorelei`. You can find the package name for each avatar style
in the documentation of each avatar style. Look for the section "Details".

```js
import { createAvatar } from '@dicebear/core';
import * as lorelei from '@dicebear/lorelei';

const avatar = createAvatar(lorelei, {
  seed: 'John Doe',
  // ... other options
});

const svg = avatar.toString();
```
