![DiceBear Avatars - Code Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/v4/packages/avatars-code-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-code-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-code-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-code-sprites)

<p>
    <img src="https://avatars.dicebear.com/api/code/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/code/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/api/code/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                     | url                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/code/example.svg" width="60" />                                                  | https://avatars.dicebear.com/api/code/example.svg                                                  |
| <img src="https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-code-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-code-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name            | alias | type   | default                      | description                                                                                                                                       |
| --------------- | ----- | ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius          | r     | number | `0`                          | Avatar border radius                                                                                                                              |
| base64          |       | bool   | `false`                      | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width           | w     | number | `null`                       | Fixed width                                                                                                                                       |
| height          | h     | number | `null`                       | Fixed height                                                                                                                                      |
| margin          | m     | number | `0`                          | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background      | b     | string | `null`                       | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent       |       | string | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br> **Automatically detected by the HTTP API**                                                             |
| type            |       | string | `qr`                         | Currently only "qr" is supported                                                                                                                  |
| color           |       | string | `null`                       | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| correctionLevel |       | string | `M`                          | Choose from `L`, `M`, `Q`, `H`                                                                                                                    |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
