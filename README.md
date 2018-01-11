# DiceBear Avatars

![license](https://img.shields.io/github/license/dicebear/avatars.svg)
[![npm](https://img.shields.io/npm/v/@dicebear/avatars.svg)](https://www.npmjs.com/package/@dicebear/avatars)
![Bower](https://img.shields.io/bower/v/dicebear-avatars.svg)

Pixel-Art Avatar and Identicon Generator by Identifier in JavaScript for Browsers and NodeJS.  
Test in your Browser: <https://avatars.dicebear.com/>

![](http://avatars.dicebear.com/v1/female/1/60.png)
![](http://avatars.dicebear.com/v1/male/2/60.png)
![](http://avatars.dicebear.com/v1/female/3/60.png)
![](http://avatars.dicebear.com/v1/male/4/60.png)
![](http://avatars.dicebear.com/v1/female/5/60.png)
![](http://avatars.dicebear.com/v1/male/6/60.png)
![](http://avatars.dicebear.com/v1/female/7/60.png)
![](http://avatars.dicebear.com/v1/male/8/60.png)

:exclamation: **Master build!** See https://github.com/DiceBear/avatars/tree/1.0.1 for the last stable version.

## Use the HTTP-API

```
GET https://avatars.dicebear.com/v1/:spriteSet/:seed/:size.png
```

```
:spriteSet => male|female|identicon
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
| ![](http://avatars.dicebear.com/v1/identicon/doe/100.png)   | <http://avatars.dicebear.com/v1/identicon/doe/100.png>   |
| ![](http://avatars.dicebear.com/v1/identicon/doe/60.png)    | <http://avatars.dicebear.com/v1/identicon/doe/60.png>    |

### Host your own API-Server

[Check out our OpenSource API-Server](https://github.com/DiceBear/avatars-server)

## Use the library

### Installation

#### Using npm

```
npm install @dicebear/avatars
```

#### Using yarn

```
yarn add @dicebear/avatars
```

#### Use a CDN

```
<script type="text/javascript" src="//rawgit.com/DiceBear/avatars/2.0.0/dist/avatars.min.js"></script>
```

#### Download archive

* [Master build](https://github.com/DiceBear/avatars/archive/master.zip)

### Create an avatar

```js
var avatars = new Avatars(Avatars.SPRITE_SETS.male); // male, female, identicon

avatars.create('custom-seed').then(function(avatar) {
  // Resize avatar and get as png data url
  let dataUrl = avatar.getPNG({
    size: 200
  });

  // Get as jpeg data url with white background
  let dataUrl = avatar.getJPEG({
    background: 200
  });
});
```

### Create your own sprite sets

#### 1. Step - Create your sprite images

See examples: <https://github.com/DiceBear/avatars/tree/master/assets/male>

Sprite parts must be arranged horizontally. The library will detect the dimensions automatically.

#### 2. Step - Create your sprite set object

See examples: <https://github.com/DiceBear/avatars/tree/master/src/spriteSet>

---

_Inspired by [8biticon](https://github.com/matveyco/8biticon)_
