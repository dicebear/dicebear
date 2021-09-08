<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />Avataaars</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear Avatars</a>.</strong><br />
    <a href="https://avataaars.com/">Avataaars</a>
    by Pablo Stanley
    licensed under
      <a href="https://avataaars.com/">Free for personal and commercial use.</a>.
</p>

<p align="center">
  While our code is MIT licensed, the design is licensed under
    <a href="https://avataaars.com/">Free for personal and commercial use.</a>.
  See <a href="https://dicebear.com/licenses">license overview</a> for more information.
</p>

----

## Usage

Install the DiceBear package and this Avatar styles with the following command.

```
npm install @dicebear/avatars @dicebear/avataaars --save
```

Now you are ready to create your first Avatar.

```js
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avataaars';

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

All [options from DiceBear](https://avatars.dicebear.com/docs/options) and additionally the following:

### style

type: `array`  
allowed: `circle`, `default`  
default: `['default']`


### clothing

type: `array`  
allowed: `blazerAndShirt`, `blazerAndSweater`, `collarAndSweater`, `graphicShirt`, `hoodie`, `overall`, `shirtCrewNeck`, `shirtScoopNeck`, `shirtVNeck`  
default: `['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck']`


### mouth

type: `array`  
allowed: `concerned`, `default`, `disbelief`, `eating`, `grimace`, `sad`, `screamOpen`, `serious`, `smile`, `tongue`, `twinkle`, `vomit`  
default: `['concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad', 'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit']`


### nose

type: `array`  
allowed: `default`  
default: `['default']`


### eyes

type: `array`  
allowed: `closed`, `cry`, `default`, `eyeRoll`, `happy`, `hearts`, `side`, `squint`, `surprised`, `winkWacky`, `wink`, `xDizzy`  
default: `['closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts', 'side', 'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy']`


### eyebrows

type: `array`  
allowed: `angryNatural`, `defaultNatural`, `flatNatural`, `frownNatural`, `raisedExcitedNatural`, `sadConcernedNatural`, `unibrowNatural`, `upDownNatural`, `angry`, `default`, `raisedExcited`, `sadConcerned`, `upDown`  
default: `['angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural', 'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural', 'upDownNatural', 'angry', 'default', 'raisedExcited', 'sadConcerned', 'upDown']`


### top

type: `array`  
allowed: `eyepatch`, `hat`, `hijab`, `turban`, `winterHat1`, `winterHat02`, `winterHat03`, `winterHat04`, `bob`, `bun`, `curly`, `curvy`, `dreads`, `frida`, `fro`, `froBand`, `longButNotTooLong`, `miaWallace`, `shavedSides`, `straight02`, `straight01`, `straightAndStrand`, `dreads01`, `dreads02`, `frizzle`, `shaggy`, `shaggyMullet`, `shortCurly`, `shortFlat`, `shortRound`, `shortWaved`, `sides`, `theCaesar`, `theCaesarAndSidePart`, `bigHair`  
default: `['eyepatch', 'hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froBand', 'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02', 'straight01', 'straightAndStrand', 'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet', 'shortCurly', 'shortFlat', 'shortRound', 'shortWaved', 'sides', 'theCaesar', 'theCaesarAndSidePart', 'bigHair']`


### topProbability

type: ``  
default: `100`


### facialHair

type: `array`  
allowed: `beardLight`, `beardMagestic`, `beardMedium`, `moustacheFancy`, `moustacheMagnum`  
default: `['beardLight', 'beardMagestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum']`


### facialHairProbability

type: ``  
default: `10`


### accessories

type: `array`  
allowed: `kurt`, `prescription01`, `prescription02`, `round`, `sunglasses`, `wayfarers`  
default: `['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers']`


### accessoriesProbability

type: ``  
default: `10`


### clothingGraphic

type: `array`  
allowed: `bat`, `bear`, `cumbia`, `deer`, `diamond`, `hola`, `pizza`, `resist`, `skull`, `skullOutline`  
default: `['bat', 'bear', 'cumbia', 'deer', 'diamond', 'hola', 'pizza', 'resist', 'skull', 'skullOutline']`


### accessoriesColor

type: `array`  
default: `['black', 'blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red', 'white']`


### clothesColor

type: `array`  
default: `['black', 'blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red', 'white']`


### hatColor

type: `array`  
default: `['black', 'blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red', 'white']`


### hairColor

type: `array`  
default: `['auburn', 'black', 'blonde', 'blondeGolden', 'brown', 'brownDark', 'pastelPink', 'platinum', 'red', 'silverGray']`


### skinColor

type: `array`  
default: `['black', 'brown', 'darkBrown', 'light', 'pale']`


### facialHairColor

type: `array`  
default: `['auburn', 'black', 'blonde', 'blondeGolden', 'brown', 'brownDark', 'pastelPink', 'platinum', 'red', 'silverGray']`



## Build this package

```
npm run build
```

## Test this package

```
npm run test
```
