![DiceBear Avatars - Initials Sprite Collection](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars-initials-sprites/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars-initials-sprites.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars-initials-sprites.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars-initials-sprites)

<p>
    <img src="https://avatars.dicebear.com/v2/initials/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Irene%20West.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Joshua%20Nelson.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Terrence%20Gomez.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Charlie%20Sanders.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Eli%20Chambers.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Carla%20Chavez.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Clarence%20Lawson.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/Vivan%20Wade.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this sprite collection. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/initials/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                            | url                                                                                       |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/v2/initials/John%20Doe.svg" width="60" />                                   | https://avatars.dicebear.com/v2/initials/John%20Doe.svg                                   |
| <img src="https://avatars.dicebear.com/v2/initials/John%20Doe.svg?options[fontSize]=80" width="60" />              | https://avatars.dicebear.com/v2/initials/John%20Doe.svg?options[fontSize]=80              |
| <img src="https://avatars.dicebear.com/v2/initials/John%20Doe.svg?options[backgroundColorLevel]=900" width="60" /> | https://avatars.dicebear.com/v2/initials/John%20Doe.svg?options[backgroundColorLevel]=900 |

### NPM

Install the Avatars and this sprite collection with the following command.

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

| name                 | type             | default                      | description                                                                                                                                                                                                       |
| -------------------- | ---------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius               | number           | `0`                          | Avatar border radius                                                                                                                                                                                              |
| base64               | bool             | `false`                      | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                                                                                            |
| width                | number           | `null`                       | Fixed width                                                                                                                                                                                                       |
| height               | number           | `null`                       | Fixed height                                                                                                                                                                                                      |
| margin               | number           | `0`                          | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                                                                                               |
| background           | string           | `null`                       | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                                 |
| backgroundColors     | array of strings | `null`                       | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `agreenmber`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| backgroundColorLevel | number           | `600`                        | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                              |
| fontSize             | number           | `50`                         | Number between 1 and 100                                                                                                                                                                                          |
| chars                | number           | `2`                          | Number between 0 and 2                                                                                                                                                                                            |
| bold                 | bool             | `false`                      |                                                                                                                                                                                                                   |
| userAgent            | string           | `window.navigator.userAgent` | User-Agent for legacy browser fallback                                                                                                                                                                            |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
