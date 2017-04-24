# DiceBear Avatars

Seeded Avatars in JavScript for Browsers and NodeJS.  
Test in your Browser: <https://avatars.dicebear.com/>

![](http://avatars.dicebear.com/v1/female/1/60.png)
![](http://avatars.dicebear.com/v1/male/3/60.png)
![](http://avatars.dicebear.com/v1/female/3/60.png)
![](http://avatars.dicebear.com/v1/male/8/60.png)
![](http://avatars.dicebear.com/v1/female/31/60.png)
![](http://avatars.dicebear.com/v1/male/83/60.png)
![](http://avatars.dicebear.com/v1/female/33/60.png)
![](http://avatars.dicebear.com/v1/male/88/60.png)


## Use the API

```
GET https://avatars.dicebear.com/:spriteSet/:seed/:size.png
```

```
:spriteSet => male|female
:seed => string|number
:size => 20 - 200 (px)
```

### Examples

| Image                                                       | URL                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| ![](http://avatars.dicebear.com/v1/male/john-doe/100.png)   | <http://avatars.dicebear.com/v1/male/john-doe/100.png>   |
| ![](http://avatars.dicebear.com/v1/male/john-doe/60.png)    | <http://avatars.dicebear.com/v1/male/john-doe/60.png>    |
| ![](http://avatars.dicebear.com/v1/female/jane-doe/100.png) | <http://avatars.dicebear.com/v1/female/jane-doe/100.png> |
| ![](http://avatars.dicebear.com/v1/female/jane-doe/60.png)  | <http://avatars.dicebear.com/v1/female/jane-doe/60.png>  |


### Host your own API-Server
[Checkout our OpenSource API-Server](https://github.com/DiceBear/avatars-server)


## Use the library

### Installation

#### Using bower

```
bower install dicebear-avatars
```

#### Using npm

```
npm install @dicebear/avatars
```

#### Use a CDN

##### Without Dependencies

```
<script type="text/javascript" src="https://rawgit.com/DiceBear/avatars/master/dist/avatars.min.js"></script>
```

##### With dependencies

```
<script type="text/javascript" src="https://rawgit.com/DiceBear/avatars/master/dist/avatars.pack.min.js"></script>
```

#### Download archive

- [Master build](https://github.com/DiceBear/avatars/archive/master.zip)

### Dependencies

DiceBear Avatars requires [async](https://github.com/caolan/async), [chance](https://github.com/chancejs/chancejs) and [one-color](https://github.com/One-com/one-color). Load this libraries from a CDN, from bower or use the [avatars.pack.min.js](https://github.com/DiceBear/avatars/blob/master/dist/avatars.pack.min.js) bundled within this Repository.

### Create an avatar

#### Male avatar

```
var avatars = var Avatars(Avatars.SPRITE_SETS.male);
var seed = 'custom-seed';

avatars.create(seed, { size: 200 }, function(err, canvas) {
  // canvas.toDataURL()
});
```

#### Female avatar

```
var avatars = var Avatars(Avatars.SPRITE_SETS.female);
var seed = 'custom-seed';

avatars.create(seed, { size: 200 }, function(err, canvas) {
  // canvas.toDataURL()
});
```

#### Options

- **size:** number
- **order:** sprite order as array


### Create your own sprite sets

#### 1. Step - Create your sprite images

See examples: <https://github.com/DiceBear/avatars/tree/master/assets/male>

Sprite parts must be arranged horizontally. The library will detect the dimensions automatically.

#### 2. Step - Create your sprite set object

See examples: <https://github.com/DiceBear/avatars/tree/master/src/spriteSets>

--------
_Inspired by [8biticon](https://github.com/matveyco/8biticon)_
