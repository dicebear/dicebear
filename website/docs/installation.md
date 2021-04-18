---
title: Installation
slug: /docs/installation
---

Choose NPM if you want to use a [avatar style](/styles) that is not available via the HTTP-API.

Install the Avatars package with the following command.

    npm install --save @dicebear/avatars

You also need to add a [avatar style](/styles). In our example, we will use the male avatar style.

    npm install --save @dicebear/avatars-male-sprites

Now you are ready to create your first Avatar.

```js
import { createAvatar } from `@dicebear/avatars`;
import * as style from `@dicebear/avatars-identicon-sprites`;

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
```

You can also omit seed to create a completely random avatar.

:::note  
We provide a large number of avatar styles from different designers. The designs are licensed under different licenses
that the designers can choose themselves. Some licenses require attribution. For a quick overview we have created an
[license overview](/licenses) for you.  
:::
