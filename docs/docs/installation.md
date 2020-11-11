---
title: Installation
slug: /docs/installation
---

Choose NPM if you want to use a avatar style that is not available via the HTTP-API.

Install the Avatars package with the following command.

    npm install --save @dicebear/avatars

You also need to add a avatar style. In our example, we will use the male avatar style.

    npm install --save @dicebear/avatars-male-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-male-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```
