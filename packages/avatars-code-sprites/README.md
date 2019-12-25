![DiceBear Avatars - Code Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-code-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-code-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-code-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-code-sprites)

<p>
    <img src="https://avatars.dicebear.com/v2/code/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/code/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                    | url                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/code/example.svg" width="60" />                                                  | https://avatars.dicebear.com/v2/code/example.svg                                                  |
| <img src="https://avatars.dicebear.com/v2/code/example.svg?options[padding]=1&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/v2/code/example.svg?options[padding]=1&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-code-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-code-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name            | type   | default | description                                                                                                                                       |
| --------------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | string | `qr`    | Currently only "qr" is supported                                                                                                                  |
| padding         | number | `0`     | Distance to the edge of the image<br> **HTTP-API limitation** Maximum value: `1`                                                                  |
| color           | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| background      | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| correctionLevel | string | `M`     | Choose from `L`, `M`, `Q`, `H`                                                                                                                    |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
