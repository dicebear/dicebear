<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />Bottts</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear Avatars</a>.</strong><br />
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
npm install @dicebear/core @dicebear/bottts --save
```

Now you are ready to create your first Avatar.

```js
import { createAvatar } from '@dicebear/core';
import * as style from '@dicebear/bottts';

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

All [options from DiceBear](https://avatars.dicebear.com/docs/options) and
additionally the following:

### baseColor

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

### face

type: `array`  
allowed: `round01`, `round02`, `square01`, `square02`, `square03`, `square04`  
default:
`['round01', 'round02', 'square01', 'square02', 'square03', 'square04']`

### mouth

type: `array`  
allowed: `bite`, `diagram`, `grill01`, `grill02`, `grill03`, `smile01`,
`smile02`, `square01`, `square02`  
default:
`['bite', 'diagram', 'grill01', 'grill02', 'grill03', 'smile01', 'smile02', 'square01', 'square02']`

### sides

type: `array`  
allowed: `antenna01`, `antenna02`, `cables01`, `cables02`, `round`, `square`,
`squareAssymetric`  
default:
`['antenna01', 'antenna02', 'cables01', 'cables02', 'round', 'square', 'squareAssymetric']`

### sidesProbability

type: `integer`  
minimum: `0`  
maximum: `100`  
default: `100`

### texture

type: `array`  
allowed: `camo01`, `camo02`, `circuits`, `dirty01`, `dirty02`, `dots`,
`grunge01`, `grunge02`  
default:
`['camo01', 'camo02', 'circuits', 'dirty01', 'dirty02', 'dots', 'grunge01', 'grunge02']`

### textureProbability

type: `integer`  
minimum: `0`  
maximum: `100`  
default: `50`

### top

type: `array`  
allowed: `antenna`, `antennaCrooked`, `bulb01`, `glowingBulb01`,
`glowingBulb02`, `horns`, `lights`, `pyramid`, `radar`  
default:
`['antenna', 'antennaCrooked', 'bulb01', 'glowingBulb01', 'glowingBulb02', 'horns', 'lights', 'pyramid', 'radar']`

### topProbability

type: `integer`  
minimum: `0`  
maximum: `100`  
default: `100`

## Build this package

```
npm run build
```

## Test this package

```
npm run test
```
