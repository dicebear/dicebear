import * as fs from 'fs';
import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../model/sprite';
import Color from '../model/color';
import ColorSet from '../model/colorSet';

let identiconSpriteSet: SpriteSetInterface = random => {
  let base64Prefix = 'data:image/png;base64,';

  // Thanks to [Andrew Kensler](http://eastfarthing.com/blog/2016-05-06-palette/)
  let color = new ColorSet([
    new Color('#d6a090'),
    new Color('#fe3b1e'),
    new Color('#a12c32'),
    new Color('#fa2f7a'),
    new Color('#fb9fda'),
    new Color('#e61cf7'),
    new Color('#992f7c'),
    new Color('#47011f'),
    new Color('#051155'),
    new Color('#4f02ec'),
    new Color('#2d69cb'),
    new Color('#00a6ee'),
    new Color('#6febff'),
    new Color('#08a29a'),
    new Color('#2a666a'),
    new Color('#063619'),
    new Color('#4a4957'),
    new Color('#8e7ba4'),
    new Color('#b7c0ff'),
    new Color('#acbe9c'),
    new Color('#827c70'),
    new Color('#5a3b1c'),
    new Color('#ae6507'),
    new Color('#f7aa30'),
    new Color('#f4ea5c'),
    new Color('#9b9500'),
    new Color('#566204'),
    new Color('#11963b'),
    new Color('#51e113'),
    new Color('#08fdcc')
  ]);

  let spriteSet = {
    1: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/1.png', 'base64'),
      colorSet: color
    }),
    2: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/2.png', 'base64'),
      colorSet: color
    }),
    3: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/3.png', 'base64'),
      colorSet: color
    }),
    4: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/4.png', 'base64'),
      colorSet: color
    }),
    5: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/5.png', 'base64'),
      colorSet: color
    })
  };

  return Promise.resolve(spriteSet);
};

export default identiconSpriteSet;
