---
title: Initials
slug: /styles/initials
---

<p>
    <img src="https://avatars.dicebear.com/api/initials/Sean%20Moore.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Lionel%20Quinn.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Lydia%20Ellis.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Bryan%20Phelps.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Ronald%20Frank.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Annette%20Klein.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Brent%20Hill.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Stanley%20Newman.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/initials/Grace%20Singleton.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/initials/:seed.svg

See the [HTTP API documentation](/docs/http-api) for more information.

#### Examples

| preview                                                                                                    | url                                                                               |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg" width="60" />                          | https://avatars.dicebear.com/api/initials/John%20Doe.svg                          |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg?fontSize=80" width="60" />              | https://avatars.dicebear.com/api/initials/John%20Doe.svg?fontSize=80              |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg?backgroundColorLevel=900" width="60" /> | https://avatars.dicebear.com/api/initials/John%20Doe.svg?backgroundColorLevel=900 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-initials-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-initials-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

## Options

| name                 | alias | type             | default                      | description                                                                                                                                                                                                  |
| -------------------- | ----- | ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| radius               | r     | number           | `0`                          | Avatar border radius                                                                                                                                                                                         |
| dataUri              |       | bool             | `false`                      | Return avatar as data uri instead of XML <br /> **Not supported by the HTTP API**                                                                                                                            |
| width                | w     | number           | `null`                       | Fixed width                                                                                                                                                                                                  |
| height               | h     | number           | `null`                       | Fixed height                                                                                                                                                                                                 |
| margin               | m     | number           | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                                                                                        |
| background           | b     | string           | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                          |
| userAgent            |       | string           | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                                                                                      |
| backgroundColors     |       | array of strings | `null`                       | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `green`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| backgroundColorLevel |       | number           | `600`                        | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                         |
| fontSize             |       | number           | `50`                         | Number between 1 and 100                                                                                                                                                                                     |
| chars                |       | number           | `2`                          | Number between 0 and 2                                                                                                                                                                                       |
| bold                 |       | bool             | `false`                      |
