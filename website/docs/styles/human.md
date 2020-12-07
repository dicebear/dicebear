---
title: Human
slug: /styles/human
---

This avatar style combines [male](https://www.npmjs.com/package/@dicebear/avatars-male-sprites) and
[female](https://www.npmjs.com/package/@dicebear/avatars-female-sprites) and selects the gender randomly.

<p>
    <img src="https://avatars.dicebear.com/api/human/Sean%20Moore.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Lionel%20Quinn.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Lydia%20Ellis.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Bryan%20Phelps.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Ronald%20Frank.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Annette%20Klein.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Brent%20Hill.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Stanley%20Newman.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/human/Grace%20Singleton.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/human/:seed.svg

See the [HTTP API documentation](/docs/http-api) for more information.

#### Examples

| preview                                                                                  | url                                                             |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/human/example.svg" width="60" />              | https://avatars.dicebear.com/api/human/example.svg              |
| <img src="https://avatars.dicebear.com/api/human/example.svg?mood[]=happy" width="60" /> | https://avatars.dicebear.com/api/human/example.svg?mood[]=happy |
| <img src="https://avatars.dicebear.com/api/human/example.svg?mood[]=sad" width="60" />   | https://avatars.dicebear.com/api/human/example.svg?mood[]=sad   |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-human-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-human-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name       | alias | type             | default                         | description                                                                                                                                         |
| ---------- | ----- | ---------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius     | r     | number           | `0`                             | Avatar border radius                                                                                                                                |
| dataUri    |       | bool             | `false`                         | Return avatar as data uri instead of XML <br /> **Not supported by the HTTP API**                                                                   |
| width      | w     | number           | `null`                          | Fixed width                                                                                                                                         |
| height     | h     | number           | `null`                          | Fixed height                                                                                                                                        |
| margin     | m     | number           | `0`                             | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                               |
| background | b     | string           | `null`                          | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent  |       | string           | `window.navigator.userAgent`    | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                             |
| mood       |       | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised`                                                                                                        |
