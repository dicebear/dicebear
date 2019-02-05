![DiceBear Avatars - Jdenticon Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-jdenticon-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/github/license/dicebear/avatars-jdenticon-sprites.svg)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-jdenticon-sprites.svg)](https://www.npmjs.com/package/@dicebear/avatars-jdenticon-sprites)

[Jdenticon](https://github.com/dmester/jdenticon) wrapper for DiceBear Avatars.

<p>
    <img src="https://avatars.dicebear.com/v2/jdenticon/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/jdenticon/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`option` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                           | url                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/jdenticon/example.svg" width="60" />                                                    | https://avatars.dicebear.com/v2/jdenticon/example.svg                                                    |
| <img src="https://avatars.dicebear.com/v2/jdenticon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/v2/jdenticon/example.svg?options[padding]=0.4&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-jdenticon-sprites jdenticon

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-jdenticon-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name                | type                 | default | description                       |
| ------------------- | -------------------- | ------- | --------------------------------- |
| hues                | array of numbers     | `null`  | Icon hue                          |
| padding             | number               | `0`     | Distance to the edge of the image |
| colorLightness      | array of two numbers | `null`  | Colored shapes - Lightness        |
| grayscaleLightness  | array of two numbers | `null`  | Grayscale shapes - Lightness      |
| colorSaturation     | number               | `null`  | Colored shapes - Saturation       |
| grayscaleSaturation | number               | `null`  | Grayscale shapes - Saturation     |
| background          | string               | `null`  | Any valid color identifier        |

## Further informations

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
