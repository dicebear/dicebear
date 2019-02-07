![DiceBear Avatars](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars/banner.svg?sanitize=true)

![license]https://img.shields.io/npm/l/@dicebear/avatars.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars)

Avatars allows you to create placeholder avatars. You can choose between simple identicons and lovely designed characters.
And best of all: We provide a simple and free HTTP API that you can use right away!

https://avatars.dicebear.com

<p>
    <img src="https://avatars.dicebear.com/v2/male/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/:sprites/:seed.svg

Replace `:sprites` with `male`, `female`, `identicon`, `gridy`, `avataaars` or `jdenticon`. The value of `:seed` can be anything you
like - but **don't** use any sensitive or personal data here!

The used sprite collection may offer additional options, which can be set using the GET parameter named `options`.
For example, to create a happy _male_ avatar with the seed `john`, the following URL can be used:

    https://avatars.dicebear.com/v2/male/john.svg?options[mood]=happy

### NPM

Choose NPM if you want to use a spriteCollection that is not available via the HTTP-API.

Install the Avatars package with the following command.

    npm install --save @dicebear/avatars

You also need to add a sprite collection. In our example, we will use the male sprite collection.

    npm install --save @dicebear/avatars-male-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-male-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Further informations

You can find the complete documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
