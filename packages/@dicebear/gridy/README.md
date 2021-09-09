<h1 align="center"><img src="./tests/svg/0.svg" width="124" /> <br />Gridy</h1>
<p align="center">
  <strong>Avatar Style for <a href="https://dicebear.com/">DiceBear Avatars</a>.</strong><br />
    <a href="https://github.com/darosh/gridys/tree/master/packages/gridy-app-avatars">Gridy</a>
    by Jan Forst
    licensed under
      <a href="https://github.com/darosh/gridys/blob/master/packages/gridy-app-avatars/LICENSE">MIT</a>.
</p>


----

## Usage

Install the DiceBear package and this Avatar styles with the following command.

```
npm install @dicebear/avatars @dicebear/gridy --save
```

Now you are ready to create your first Avatar.

```js
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/gridy';

let svg = createAvatar(style, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

All [options from DiceBear](https://avatars.dicebear.com/docs/options) and additionally the following:

### body

type: `array`  
allowed: `variant08`, `variant07`, `variant06`, `variant05`, `variant04`, `variant03`, `variant02`, `variant01`  
default: `['variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01']`


### eyes

type: `array`  
allowed: `variant08`, `variant07`, `variant06`, `variant05`, `variant04`, `variant03`, `variant02`, `variant01`  
default: `['variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01']`


### mouth

type: `array`  
allowed: `variant08`, `variant07`, `variant06`, `variant05`, `variant04`, `variant03`, `variant02`, `variant01`  
default: `['variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01']`


### bodyColor

type: `array`  
default: `['amber', 'blue', 'blueGray', 'brown', 'cyan', 'deepOrange', 'deepPurple', 'green', 'grey', 'indigo', 'lightBlue', 'lightGreen', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']`


### eyesColor

type: `array`  
default: `['amber', 'blue', 'blueGray', 'brown', 'cyan', 'deepOrange', 'deepPurple', 'green', 'grey', 'indigo', 'lightBlue', 'lightGreen', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']`


### mouthColor

type: `array`  
default: `['amber', 'blue', 'blueGray', 'brown', 'cyan', 'deepOrange', 'deepPurple', 'green', 'grey', 'indigo', 'lightBlue', 'lightGreen', 'lime', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']`



## Build this package

```
npm run build
```

## Test this package

```
npm run test
```
