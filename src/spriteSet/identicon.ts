import * as fs from 'fs';
import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../model/sprite';
import Color from '../model/color';
import ColorSet from '../model/colorSet';

let identiconSpriteSet: SpriteSetInterface = random => {
  let base64Prefix = 'data:image/png;base64,';

  // Thanks to [materialui.co](https://www.materialui.co/colors)
  let color = new ColorSet([
    new Color('#e57373'),
    new Color('#F06292'),
    new Color('#BA68C8'),
    new Color('#9575CD'),
    new Color('#7986CB'),
    new Color('#64B5F6'),
    new Color('#4FC3F7'),
    new Color('#4DD0E1'),
    new Color('#4DB6AC'),
    new Color('#81C784'),
    new Color('#AED581'),
    new Color('#DCE775'),
    new Color('#FFF176'),
    new Color('#FFD54F'),
    new Color('#FFB74D'),
    new Color('#FF8A65')
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
