---
title: Identicon
slug: /styles/identicon
---

Inspired by [donpark/identicon](https://github.com/donpark/identicon)

<p>
    <img src="https://avatars.dicebear.com/api/identicon/1.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/2.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/3.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/4.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/5.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/6.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/7.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/8.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/identicon/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/identicon/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                          | url                                                                                     |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/identicon/example.svg" width="60" />                                  | https://avatars.dicebear.com/api/identicon/example.svg                                  |
| <img src="https://avatars.dicebear.com/api/identicon/example.svg?padding=0.4&background=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/api/identicon/example.svg?padding=0.4&background=%23f0f0f0 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-identicon-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-identicon-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name       | alias | type             | default                      | description                                                                                                                                                                                                  |
| ---------- | ----- | ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| radius     | r     | number           | `0`                          | Avatar border radius                                                                                                                                                                                         |
| base64     |       | bool             | `false`                      | Return avatar as base64 data uri instead of XML <br /> **Not supported by the HTTP API**                                                                                                                     |
| width      | w     | number           | `null`                       | Fixed width                                                                                                                                                                                                  |
| height     | h     | number           | `null`                       | Fixed height                                                                                                                                                                                                 |
| margin     | m     | number           | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                                                                                        |
| background | b     | string           | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                          |
| userAgent  |       | string           | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                                                                                      |
| colors     |       | array of strings | `null`                       | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `green`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| colorLevel |       | number           | `600`                        | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                         |
