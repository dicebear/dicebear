![DiceBear Avatars](https://raw.githubusercontent.com/DiceBear/avatars/master/packages/avatars/banner.svg?sanitize=true)

![license](https://img.shields.io/npm/l/@dicebear/avatars.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars.svg?style=flat-square)](https://www.npmjs.com/package/@dicebear/avatars)

Avatars is an avatar placeholder library for designers and developers. You can choose between simple identicons and lovely designed characters.
And best of all: We provide a simple and free HTTP API that you can use right away!

https://avatars.dicebear.com

<p>
    <img src="https://avatars.dicebear.com/v2/male/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/female/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/identicon/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/initials/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/bottts/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/avataaars/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/jdenticon/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/gridy/John%20Doe.svg" width="60" />
    <img src="https://avatars.dicebear.com/v2/code/John%20Doe.svg" width="60" />
</p>

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/v2/:sprites/:seed.svg

Replace `:sprites` with `male`, `female`, `human`, `identicon`, `initials`, `bottts`, `avataaars`, `jdenticon`, `gridy` or `code`. The value of `:seed` can be anything you
like - but **don't** use any sensitive or personal data here!

The used sprite collection may offer additional options, which can be set using the GET parameter named `options`.
For example, to create a happy _male_ avatar with the seed `john`, the following URL can be used:

    https://avatars.dicebear.com/v2/male/john.svg?options[mood]=happy

### NPM

Choose NPM if you want to use a spriteCollection that is not available via the HTTP-API.

Install the Avatars package with the following command.

    npm install --save @dicebear/avatars

You also need to add a sprite collection. In our example, we will use the male sprite collection.

    npm install --save @dicebear/avatars-male-sprites

Now you are ready to create your first Avatar.

```js
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-male-sprites';

let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');
```

### Available options

The following options are available for each sprite collection.

| name       | type   | default                      | description                                                                                                                                       |
| ---------- | ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius     | number | `0`                          | Avatar border radius                                                                                                                              |
| base64     | bool   | `false`                      | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width      | number | `null`                       | Fixed width                                                                                                                                       |
| height     | number | `null`                       | Fixed height                                                                                                                                      |
| margin     | number | `0`                          | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background | string | `null`                       | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| userAgent  | string | `window.navigator.userAgent` | User-Agent for legacy browser fallback<br> **Automatically detected by the HTTP API**                                                             |

More available options can be found in the README.md of each sprite collection.

## Further information

You can find the complete documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
