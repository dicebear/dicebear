![DiceBear Avatars - Identicon Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-identicon-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-identicon-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-identicon-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-identicon-sprites)

<p>
    <img src="https://avatars.dicebear.com/v2/identicon/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/identicon/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                           | url                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/identicon/example.svg" width="60" />                                                    | https://avatars.dicebear.com/v2/identicon/example.svg                                                    |
| <img src="https://avatars.dicebear.com/v2/identicon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/v2/identicon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0 |

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

| name       | type             | default | description                                                                                                                                                                                                       |
| ---------- | ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| padding    | int              | `0`     | Distance to the edge of the image<br> **HTTP-API limitation** Maximum value: `0.4`                                                                                                                                |
| background | int              | `#FFF`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                                 |
| colors     | array of strings | `null`  | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `agreenmber`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| colorLevel | number           | `600`   | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                              |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [donpark/identicon](https://github.com/donpark/identicon)_
