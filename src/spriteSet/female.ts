import * as fs from 'fs';
import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../model/sprite';
import Color from '../model/color';
import ColorSet from '../model/colorSet';
import LightnessDifference from '../color/modifier/lightness/difference';
import LightnessDarker from '../color/modifier/lightness/darker';

let femaleSpriteSet: SpriteSetInterface = random => {
  let base64Prefix = 'data:image/png;base64,';

  let skinColor = new ColorSet([
    new Color('#ffdbac'),
    new Color('#f1c27d'),
    new Color('#e0ac69'),
    new Color('#c68642'),
    new Color('#8d5524')
  ]);

  let hairColor = new LightnessDifference(
    new ColorSet([
      new Color('#090806'),
      new Color('#2c222b'),
      new Color('#71635a'),
      new Color('#b7a69e'),
      new Color('#d6c4c2'),
      new Color('#cabfb1'),
      new Color('#dcd0ba'),
      new Color('#fff5e1'),
      new Color('#e6cea8'),
      new Color('#e5c8a8'),
      new Color('#debc99'),
      new Color('#b89778'),
      new Color('#a56b46'),
      new Color('#b55239'),
      new Color('#8d4a43'),
      new Color('#91553d'),
      new Color('#533d32'),
      new Color('#3b3024'),
      new Color('#554838'),
      new Color('#4e433f'),
      new Color('#504444'),
      new Color('#6a4e42'),
      new Color('#a7856a'),
      new Color('#977961')
    ]),
    skinColor,
    12
  );

  let spriteSet = {
    face: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/face.png', 'base64'),
      colorSet: skinColor
    }),
    eyes: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/eyes.png', 'base64'),
      colorSet: new ColorSet([
        new Color('#76778b'),
        new Color('#697b94'),
        new Color('#647b90'),
        new Color('#5b7c8b'),
        new Color('#588387')
      ])
    }),
    eyebrows: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/eyebrows.png', 'base64'),
      colorSet: new LightnessDarker(new LightnessDarker(hairColor, skinColor, 5), hairColor, 7)
    }),
    mouth: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/mouth.png', 'base64'),
      colorSet: new LightnessDarker(
        [
          new Color('#dbac98'),
          new Color('#d29985'),
          new Color('#c98276'),
          new Color('#e35d6a'),
          new Color('#e32153'),
          new Color('#de0f0d')
        ],
        skinColor,
        5
      )
    }),
    accessories: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/accessories.png', 'base64'),
      chance: 15,
      colorSet: new ColorSet([
        new Color('#daa520'),
        new Color('#ffd700'),
        new Color('#eee8aa'),
        new Color('#fafad2'),
        new Color('#d3d3d3'),
        new Color('#a9a9a9')
      ])
    }),
    glasses: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/glasses.png', 'base64'),
      chance: 25,
      colorSet: new ColorSet([
        new Color('#5f705c'),
        new Color('#43677d'),
        new Color('#5e172d'),
        new Color('#ffb67a'),
        new Color('#a04b5d'),
        new Color('#191919'),
        new Color('#323232'),
        new Color('#4b4b4b')
      ])
    }),
    clothes: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/clothes.png', 'base64'),
      colorSet: new ColorSet([
        new Color('#d11141'),
        new Color('#00b159'),
        new Color('#00aedb'),
        new Color('#f37735'),
        new Color('#ffc425'),
        new Color('#740001'),
        new Color('#ae0001'),
        new Color('#eeba30'),
        new Color('#96ceb4'),
        new Color('#ffeead'),
        new Color('#ff6f69'),
        new Color('#ffcc5c'),
        new Color('#88d8b0')
      ])
    }),
    hair: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/hair.png', 'base64'),
      chance: 95,
      colorSet: hairColor
    }),
    hat: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/hats.png', 'base64'),
      chance: 5,
      colorSet: new ColorSet([
        new Color('#cc6192'),
        new Color('#2663a3'),
        new Color('#a62116'),
        new Color('#3d8a6b'),
        new Color('#614f8a')
      ])
    })
  };

  return Promise.resolve(spriteSet);
};

export default femaleSpriteSet;
