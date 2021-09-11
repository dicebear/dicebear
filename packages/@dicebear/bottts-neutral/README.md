<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />Bottts Neutral</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear</a>.</strong><br />
    <a href="https://bottts.com/">Bottts</a>
    by Pablo Stanley
    licensed under
      <a href="https://bottts.com/">Free for personal and commercial use</a>.
</p>

<p align="center">
  While our code is MIT licensed, the design is licensed under
    <a href="https://bottts.com/">Free for personal and commercial use</a>.
  See <a href="https://dicebear.com/licenses">license overview</a> for more information.
</p>

---

## Usage

Install the DiceBear package and this Avatar styles with the following command.

```
npm install @dicebear/core @dicebear/bottts-neutral --save
```

Now you are ready to create your first Avatar.

```js
import { createAvatar } from '@dicebear/core';
import * as style from '@dicebear/bottts-neutral';

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

All [options from DiceBear](https://dicebear.com/docs/options) and additionally
the following:

### backgroundColor

type: `array`  
default:
`['amber', 'blue', 'blueGrey', 'brown', 'cyan', 'deepOrange', 'deepPurple', 'green', 'grey', 'indigo', 'lightBlue', 'lightGreen', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']`

### eyes

type: `array`  
allowed: `bulging`, `dizzy`, `eva`, `frame1`, `frame2`, `glow`, `happy`,
`hearts`, `robocop`, `round`, `roundFrame01`, `roundFrame02`, `sensor`,
`shade01`  
default:
`['bulging', 'dizzy', 'eva', 'frame1', 'frame2', 'glow', 'happy', 'hearts', 'robocop', 'round', 'roundFrame01', 'roundFrame02', 'sensor', 'shade01']`

### mouth

type: `array`  
allowed: `bite`, `diagram`, `grill01`, `grill02`, `grill03`, `smile01`,
`smile02`, `square01`, `square02`  
default:
`['bite', 'diagram', 'grill01', 'grill02', 'grill03', 'smile01', 'smile02', 'square01', 'square02']`

## Build this package

```
npm run build
```

## Test this package

```
npm run test
```
