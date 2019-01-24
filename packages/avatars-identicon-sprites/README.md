# Identicon sprite collection for DiceBear Avatars

![license](https://img.shields.io/github/license/dicebear/avatars-identicon-sprites.svg)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-identicon-sprites.svg)](https://www.npmjs.com/package/@dicebear/avatars-identicon-sprites)

<p>
    <img src="https://avatars.dicebear.com/v3/identicon/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v3/identicon/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v3/identicon/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`option` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                           | url                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v3/identicon/example.svg" width="60" />                                                    | https://avatars.dicebear.com/v3/identicon/example.svg                                                    |
| <img src="https://avatars.dicebear.com/v3/identicon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/v3/identicon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-identicon-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-identicon-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name       | type | default | description                       |
| ---------- | ---- | ------- | --------------------------------- |
| padding    | int  | `0`     | Distance to the edge of the image |
| background | int  | `#FFF`  | Any valid color identifier        |

## Further informations

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [donpark/identicon](https://github.com/donpark/identicon)_
