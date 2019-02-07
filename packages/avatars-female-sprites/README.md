![DiceBear Avatars - Female Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-female-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/github/license/dicebear/avatars-female-sprites.svg)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-female-sprites.svg)](https://www.npmjs.com/package/@dicebear/avatars-female-sprites)

<p>
    <img src="https://avatars.dicebear.com/v2/female/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/female/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`option` can be used to pass [options](#options).

#### Examples

| preview                                                                                          | url                                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/female/example.svg" width="60" />                      | https://avatars.dicebear.com/v2/female/example.svg                      |
| <img src="https://avatars.dicebear.com/v2/female/example.svg?option[mood][]=happy" width="60" /> | https://avatars.dicebear.com/v2/female/example.svg?option[mood][]=happy |
| <img src="https://avatars.dicebear.com/v2/female/example.svg?option[mood][]=sad" width="60" />   | https://avatars.dicebear.com/v2/female/example.svg?option[mood][]=sad   |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-female-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-female-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name | type             | default                         | description                                  |
| ---- | ---------------- | ------------------------------- | -------------------------------------------- |
| mood | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised` |

## Further informations

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [8biticon](https://github.com/matveyco/8biticon) (Copyright 2012 Plastic Jam - [MIT Licensed](https://github.com/matveyco/8biticon/blob/dfe624da950fb2f8c43e1151c380d333c2b12225/old_python/LICENSE))_
