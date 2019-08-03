![DiceBear Avatars - Human Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-human-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-human-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-human-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-human-sprites)

This Sprite Collection combines the Sprite Collections [male](https://www.npmjs.com/package/@dicebear/avatars-male-sprites) and [female](https://www.npmjs.com/package/@dicebear/avatars-female-sprites) and selects the gender randomly.

<p>
    <img src="https://avatars.dicebear.com/v2/human/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/human/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/human/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                          | url                                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/human/example.svg" width="60" />                       | https://avatars.dicebear.com/v2/human/example.svg                       |
| <img src="https://avatars.dicebear.com/v2/human/example.svg?options[mood][]=happy" width="60" /> | https://avatars.dicebear.com/v2/human/example.svg?options[mood][]=happy |
| <img src="https://avatars.dicebear.com/v2/human/example.svg?options[mood][]=sad" width="60" />   | https://avatars.dicebear.com/v2/human/example.svg?options[mood][]=sad   |

### NPM

Install the Avatars and this sprite collection with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-male-sprites @dicebear/avatars-female-sprites @dicebear/avatars-human-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-human-sprites';

let options = {};
let avatars = new Avatars(sprites(options));
let svg = avatars.create('custom-seed');
```

## Options

| name | type             | default                         | description                                  |
| ---- | ---------------- | ------------------------------- | -------------------------------------------- |
| mood | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised` |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
