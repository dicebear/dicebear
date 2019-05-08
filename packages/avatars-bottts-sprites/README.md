![DiceBear Avatars - Bottts Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-bottts-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-bottts-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-bottts-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-bottts-sprites)

Designed by [Pablo Stanley](https://twitter.com/pablostanley), the Sketch library can be found on
[bottts.com](https://bottts.com/).

<p>
    <img src="https://avatars.dicebear.com/v2/bottts/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/bottts/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here!

#### Examples

| preview                                                                 | url                                            |
| ----------------------------------------------------------------------- | ---------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/bottts/foo.svg" width="60" /> | https://avatars.dicebear.com/v2/bottts/foo.svg |
| <img src="https://avatars.dicebear.com/v2/bottts/bar.svg" width="60" /> | https://avatars.dicebear.com/v2/bottts/bar.svg |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-bottts-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

let avatars = new Avatars(sprites());
let svg = avatars.create('custom-seed');
```

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
