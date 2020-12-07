---
title: Jdenticon
slug: /styles/jdenticon
---

[Jdenticon](https://github.com/dmester/jdenticon) wrapper for DiceBear Avatars.

<p>
    <img src="https://avatars.dicebear.com/api/jdenticon/Sean%20Moore.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Lionel%20Quinn.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Lydia%20Ellis.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Bryan%20Phelps.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Ronald%20Frank.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Annette%20Klein.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Brent%20Hill.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Stanley%20Newman.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/jdenticon/Grace%20Singleton.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/jdenticon/:seed.svg

See the [HTTP API documentation](/docs/http-api) for more information.

#### Examples

| preview                                                                                                           | url                                                                                      |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/jdenticon/example.svg" width="60" />                                   | https://avatars.dicebear.com/api/jdenticon/example.svg                                   |
| <img src="https://avatars.dicebear.com/api/jdenticon/example.svg?padding=0.05&background=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/api/jdenticon/example.svg?padding=0.05&background=%23f0f0f0 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-jdenticon-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name                | alias | type                                 | default                      | description                                                                                                                                         |
| ------------------- | ----- | ------------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius              | r     | number                               | `0`                          | Avatar border radius                                                                                                                                |
| dataUri             |       | bool                                 | `false`                      | Return avatar as data uri instead of XML <br /> **Not supported by the HTTP API**                                                                   |
| width               | w     | number                               | `null`                       | Fixed width                                                                                                                                         |
| height              | h     | number                               | `null`                       | Fixed height                                                                                                                                        |
| margin              | m     | number                               | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                               |
| background          | b     | string                               | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent           |       | string                               | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                             |
| hues                |       | array of numbers between 0 and 360   | `null`                       | Icon hue                                                                                                                                            |
| colorLightness      |       | array of two numbers between 0 and 1 | `null`                       | Colored shapes - Lightness                                                                                                                          |
| grayscaleLightness  |       | array of two numbers between 0 and 1 | `null`                       | Grayscale shapes - Lightness                                                                                                                        |
| colorSaturation     |       | number between 0 and 1               | `null`                       | Colored shapes - Saturation                                                                                                                         |
| grayscaleSaturation |       | number between 0 and 1               | `null`                       | Grayscale shapes - Saturation                                                                                                                       |
