---
title: Avataaars
slug: /styles/avataaars
---

Designed by [Pablo Stanley](https://twitter.com/pablostanley). The Sketch library can be found on
[avataaars.com](https://avataaars.com/).

<p>
    <img src="https://avatars.dicebear.com/api/avataaars/1.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/2.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/3.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/4.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/5.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/6.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/7.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/8.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/avataaars/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/avataaars/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                              | url                                                                                         |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg" width="60" />                                      | https://avatars.dicebear.com/api/avataaars/example.svg                                      |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg?top[]=shortHair" width="60" />                      | https://avatars.dicebear.com/api/avataaars/example.svg?top[]=shortHair                      |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg?top[]=shortHair&accessoriesChance=93" width="60" /> | https://avatars.dicebear.com/api/avataaars/example.svg?top[]=shortHair&accessoriesChance=93 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-avataaars-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name              | alias | type             | default                      | description                                                                                                                                         |
| ----------------- | ----- | ---------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius            | r     | number           | `0`                          | Avatar border radius                                                                                                                                |
| base64            |       | bool             | `false`                      | Return avatar as base64 data uri instead of XML <br /> **Not supported by the HTTP API**                                                            |
| width             | w     | number           | `null`                       | Fixed width                                                                                                                                         |
| height            | h     | number           | `null`                       | Fixed height                                                                                                                                        |
| margin            | m     | number           | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                               |
| background        | b     | string           | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent         |       | string           | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                             |
| style             |       | string           | `transparent`                | One of: `transparent`, `circle`                                                                                                                     |
| mode              |       | string           | `include`                    | `include` or `exclude` passed options.                                                                                                              |
| top               |       | array of strings | `null`                       | Possible values: `longHair`, `shortHair`, `eyepatch`, `hat`, `hijab`, `turban`                                                                      |
| topChance         |       | number           | `100`                        | Probability in percent                                                                                                                              |
| hatColor          |       | array of strings | `null`                       | Possible values: `black`, `blue`, `gray`, `heather`, `pastel`, `pink`, `red`, `white`                                                               |
| hairColor         |       | array of strings | `null`                       | Possible values: `auburn`, `black`, `blonde`, `brown`, `pastel`, `platinum`, `red`, `gray`                                                          |
| accessories       |       | array of strings | `null`                       | Possible values: `kurt`, `prescription01`, `prescription02`, `round`, `sunglasses`, `wayfarers`                                                     |
| accessoriesChance |       | number           | `10`                         | Probability in percent                                                                                                                              |
| accessoriesColor  |       | array of strings | `null`                       | Possible values: `black`, `blue`, `gray`, `heather`, `pastel`, `pink`, `red`, `white`                                                               |
| facialHair        |       | array of strings | `null`                       | Possible values: `medium`, `light`, `majestic`, `fancy`, `magnum`                                                                                   |
| facialHairChance  |       | number           | `10`                         | Probability in percent                                                                                                                              |
| facialHairColor   |       | array of strings | `null`                       | Possible values: `auburn`, `black`, `blonde`, `brown`, `pastel`, `platinum`, `red`, `gray`                                                          |
| clothes           |       | array of strings | `null`                       | Possible values: `blazer`, `sweater`, `shirt`, `hoodie`, `overall`                                                                                  |
| clothesColor      |       | array of strings | `null`                       | Possible values: `black`, `blue`, `gray`, `heather`, `pastel`, `pink`, `red`, `white`                                                               |
| eyes              |       | array of strings | `null`                       | Possible values: `close`, `cry`, `default`, `dizzy`, `roll`, `happy`, `hearts`, `side`, `squint`, `surprised`, `wink`, `winkWacky`                  |
| eyebrow           |       | array of strings | `null`                       | Possible values: `angry`, `default`, `flat`, `raised`, `sad`, `unibrow`, `up`, `frown`                                                              |
| mouth             |       | array of strings | `null`                       | Possible values: `concerned`, `default`, `disbelief`, `eating`, `grimace`, `sad`, `scream`, `serious`, `smile`, `tongue`, `twinkle`, `vomit`        |
| skin              |       | array of strings | `null`                       | Possible values: `tanned`, `yellow`, `pale`, `light`, `brown`, `darkBrown`, `black`                                                                 |
