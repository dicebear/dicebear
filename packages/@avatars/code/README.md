![DiceBear Avatars - Code avatar style](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/@avatars/code/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@avatars/code.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@avatars/code.svg?style=flat-square)](https://www.npmjs.com/package/@avatars/code)

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

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/code/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                     | url                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/code/example.svg" width="60" />                                                  | https://avatars.dicebear.com/api/code/example.svg                                                  |
| <img src="https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @avatars/core @avatars/code

Now you are ready to create your first Avatar.

```js
import Avatars from '@avatars/core';
import sprites from '@avatars/code';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name            | alias | type   | default | description                                                                                                                                       |
| --------------- | ----- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius          | r     | number | `0`     | Avatar border radius                                                                                                                              |
| base64          |       | bool   | `false` | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width           | w     | number | `null`  | Fixed width                                                                                                                                       |
| height          | h     | number | `null`  | Fixed height                                                                                                                                      |
| margin          | m     | number | `0`     | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background      | b     | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| type            |       | string | `qr`    | Currently only "qr" is supported                                                                                                                  |
| color           |       | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| correctionLevel |       | string | `M`     | Choose from `L`, `M`, `Q`, `H`                                                                                                                    |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
