---
title: Bottts
slug: /styles/bottts
---

Designed by [Pablo Stanley](https://twitter.com/pablostanley). The Sketch library can be found on
[bottts.com](https://bottts.com/).

<p>
    <img src="https://avatars.dicebear.com/api/bottts/Sean%20Moore.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Lionel%20Quinn.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Lydia%20Ellis.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Bryan%20Phelps.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Ronald%20Frank.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Annette%20Klein.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Brent%20Hill.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Stanley%20Newman.svg" width="60" />{ ' ' }
    <img src="https://avatars.dicebear.com/api/bottts/Grace%20Singleton.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/bottts/:seed.svg

See the [HTTP API documentation](/docs/http-api) for more information.

#### Examples

| preview                                                                                                          | url                                                                                     |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/bottts/example.svg" width="60" />                                     | https://avatars.dicebear.com/api/bottts/example.svg                                     |
| <img src="https://avatars.dicebear.com/api/bottts/example.svg?colors[]=cyan" width="60" />                       | https://avatars.dicebear.com/api/bottts/example.svg?colors[]=cyan                       |
| <img src="https://avatars.dicebear.com/api/bottts/example.svg?colors[]=cyan&primaryColorLevel=200" width="60" /> | https://avatars.dicebear.com/api/bottts/example.svg?colors[]=cyan&primaryColorLevel=200 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-bottts-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-bottts-sprites';

let avatars = new Avatars(sprites());
let svg = avatars.create('custom-seed');
```

## Options

| name                | alias | type             | default                      | description                                                                                                                                                                                                  |
| ------------------- | ----- | ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| radius              | r     | number           | `0`                          | Avatar border radius                                                                                                                                                                                         |
| dataUri             |       | bool             | `false`                      | Return avatar as data uri instead of XML <br /> **Not supported by the HTTP API**                                                                                                                            |
| width               | w     | number           | `null`                       | Fixed width                                                                                                                                                                                                  |
| height              | h     | number           | `null`                       | Fixed height                                                                                                                                                                                                 |
| margin              | m     | number           | `0`                          | Avatar margin in percent<br /> **HTTP-API limitation** Max value `25`                                                                                                                                        |
| background          | b     | string           | `null`                       | Any valid color identifier<br /> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                          |
| userAgent           |       | string           | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br /> **Automatically detected by the HTTP API**                                                                                                                      |
| colors              |       | array of strings | `null`                       | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `green`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| primaryColorLevel   |       | number           | `600`                        | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                         |
| secondaryColorLevel |       | number           | `400`                        | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                         |
| colorful            |       | boolean          | `false`                      | Assigns sides and top a random secondary color                                                                                                                                                               |
| mouthChance         |       | number           | `100`                        | Probability in percent avatar will have a mouth                                                                                                                                                              |
| sidesChance         |       | number           | `100`                        | Probability in percent avatar will have side elements                                                                                                                                                        |
| textureChance       |       | number           | `50`                         | Probability in percent avatar will have texture                                                                                                                                                              |
| topChance           |       | number           | `100`                        | Probability in percent avatar will have a top element                                                                                                                                                        |
