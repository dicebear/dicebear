---
title: Gridy
slug: /styles/gridy
---

Designed by [Jan Forst](https://github.com/darosh/gridy-avatars).

<p>
    <img src="https://avatars.dicebear.com/api/gridy/1.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/2.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/3.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/4.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/5.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/6.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/7.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/8.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/gridy/9.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/gridy/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                    | url                                                               |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/gridy/custom-seed.svg" width="60" />            | https://avatars.dicebear.com/api/gridy/custom-seed.svg            |
| <img src="https://avatars.dicebear.com/api/gridy/custom-seed.svg?colorful=1" width="60" /> | https://avatars.dicebear.com/api/gridy/custom-seed.svg?colorful=1 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-gridy-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-gridy-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name          | alias | type    | default                      | description                                                                                                                                         |
| ------------- | ----- | ------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius        | r     | number  | `0`                          | Avatar border radius                                                                                                                                |
| base64        |       | bool    | `false`                      | Return avatar as base64 data uri instead of XML <br /> **Not supported by the HTTP API**                                                            |
| width         | w     | number  | `null`                       | Fixed width                                                                                                                                         |
| height        | h     | number  | `null`                       | Fixed height                                                                                                                                        |
| margin        | m     | number  | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                               |
| background    | b     | string  | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent     |       | string  | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                             |
| colorful      |       | boolean | `false`                      | Use different colors for eyes and mouth                                                                                                             |
| deterministic |       | boolean | `false`                      | Force deterministic output (see [#64](https://github.com/DiceBear/avatars/issues/64))                                                               |
