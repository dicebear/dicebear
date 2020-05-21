![DiceBear Avatars - pixel-art avatar style](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/@avatars/pixel-art/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@avatars/pixel-art.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@avatars/pixel-art.svg?style=flat-square)](https://www.npmjs.com/package/@avatars/pixel-art)

This avatar style combines the avatar styles [male](https://www.npmjs.com/package/@avatars/male) and [female](https://www.npmjs.com/package/@avatars/female) and selects the gender randomly.

<p>
    <img src="https://avatars.dicebear.com/api/pixel-art/1.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/2.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/3.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/4.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/5.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/6.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/7.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/8.svg" width="60" />
    <img src="https://avatars.dicebear.com/api/pixel-art/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/pixel-art/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                               | url                                                                          |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg" width="60" />                       | https://avatars.dicebear.com/api/pixel-art/example.svg                       |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=happy" width="60" /> | https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=happy |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=sad" width="60" />   | https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=sad   |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @avatars/core @avatars/pixel-art

Now you are ready to create your first Avatar.

```js
import Avatars from '@avatars/core';
import sprites from '@avatars/pixel-art';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name                         | alias | type             | default                         | description                                                                                                                                       |
| ---------------------------- | ----- | ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius                       | r     | number           | `0`                             | Avatar border radius                                                                                                                              |
| base64                       |       | bool             | `false`                         | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width                        | w     | number           | `null`                          | Fixed width                                                                                                                                       |
| height                       | h     | number           | `null`                          | Fixed height                                                                                                                                      |
| margin                       | m     | number           | `0`                             | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background                   | b     | string           | `null`                          | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| mood                         |       | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised`                                                                                                      |
| skinColor                    |       | array of numbers | `null`                          | Possible values: `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                    |
| maleMustacheProbability      |       | number           | `50`                            | Probability in percent                                                                                                                            |
| maleGlassesProbability       |       | number           | `25`                            | Probability in percent                                                                                                                            |
| maleHairProbability          |       | number           | `95`                            | Probability in percent                                                                                                                            |
| maleHatProbability           |       | number           | `5`                             | Probability in percent                                                                                                                            |
| femaleAccessoriesProbability |       | number           | `15`                            | Probability in percent                                                                                                                            |
| femaleGlassesProbability     |       | number           | `25`                            | Probability in percent                                                                                                                            |
| femaleHatProbability         |       | number           | `5`                             | Probability in percent                                                                                                                            |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [8biticon](https://github.com/matveyco/8biticon) (Copyright 2012 Plastic Jam - [MIT Licensed](https://github.com/matveyco/8biticon/blob/dfe624da950fb2f8c43e1151c380d333c2b12225/old_python/LICENSE))_
