![DiceBear Avatars - Gridy Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-gridy-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/github/license/dicebear/avatars-gridy-sprites.svg)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-gridy-sprites.svg)](https://www.npmjs.com/package/@dicebear/avatars-gridy-sprites)

Designed by [Jan Forst](https://github.com/darosh/gridy-avatars).

<p>
    <img src="https://avatars.dicebear.com/v2/gridy/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/gridy/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`option` can be used to pass [options](#options).

#### Examples

| preview                                                                                           | url                                                                      |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| <img src="https://avatars.dicebear.com/v2/gridy/custom-seed.svg" width="60" />                    | https://avatars.dicebear.com/v2/gridy/custom-seed.svg                    |
| <img src="https://avatars.dicebear.com/v2/gridy/custom-seed.svg?option[colorful]=1" width="60" /> | https://avatars.dicebear.com/v2/gridy/custom-seed.svg?option[colorful]=1 |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-gridy-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-gridy-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name     | type    | default | description                             |
| -------- | ------- | ------- | --------------------------------------- |
| colorful | boolean | `false` | Use different colors for eyes and mouth |

## Further informations

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
