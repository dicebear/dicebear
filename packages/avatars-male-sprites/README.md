![DiceBear Avatars - Male Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-male-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-male-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-male-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-male-sprites)

<p>
    <img src="https://avatars.dicebear.com/v2/male/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/male/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/male/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                         | url                                                                    |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/male/example.svg" width="60" />                       | https://avatars.dicebear.com/v2/male/example.svg                       |
| <img src="https://avatars.dicebear.com/v2/male/example.svg?options[mood][]=happy" width="60" /> | https://avatars.dicebear.com/v2/male/example.svg?options[mood][]=happy |
| <img src="https://avatars.dicebear.com/v2/male/example.svg?options[mood][]=sad" width="60" />   | https://avatars.dicebear.com/v2/male/example.svg?options[mood][]=sad   |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-male-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-male-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name       | type             | default                         | description                                                                                                                                       |
| ---------- | ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius     | number           | `0`                             | Avatar border radius                                                                                                                              |
| base64     | bool             | `false`                         | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width      | number           | `null`                          | Fixed width                                                                                                                                       |
| height     | number           | `null`                          | Fixed height                                                                                                                                      |
| margin     | number           | `0`                             | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background | string           | `null`                          | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| mood       | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised`                                                                                                      |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [8biticon](https://github.com/matveyco/8biticon) (Copyright 2012 Plastic Jam - [MIT Licensed](https://github.com/matveyco/8biticon/blob/dfe624da950fb2f8c43e1151c380d333c2b12225/old_python/LICENSE))_
