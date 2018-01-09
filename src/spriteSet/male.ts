import * as fs from 'fs';
import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../model/sprite';
import Color from '../model/color';
import ColorSet from '../model/colorSet';
import LightnessDifference from '../color/modifier/lightness/difference';
import LightnessBrighter from '../color/modifier/lightness/brighter';
import LightnessDarker from '../color/modifier/lightness/darker';

let maleSpriteSet: SpriteSetInterface = random => {
  let base64Prefix = 'data:image/png;base64,';

  let skinColor = new ColorSet([
    new Color('#ffdbac'),
    new Color('#f1c27d'),
    new Color('#e0ac69'),
    new Color('#c68642'),
    new Color('#8d5524')
  ]);

  let hairColor = new LightnessDifference(
    [
      new Color('#090806'),
      new Color('#2c222b'),
      new Color('#71635a'),
      new Color('#b7a69e'),
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
    ],
    skinColor,
    12
  );

  let spriteSet = {
    face: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/face.png', 'base64'),
      colorSet: skinColor
    }),
    eyes: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/eyes.png', 'base64'),
      colorSet: new ColorSet([
        new Color('#76778b'),
        new Color('#697b94'),
        new Color('#647b90'),
        new Color('#5b7c8b'),
        new Color('#588387')
      ])
    }),
    eyebrows: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/eyebrows.png', 'base64'),
      colorSet: new LightnessDarker(new LightnessDarker(hairColor, skinColor, 5), hairColor, 7)
    }),
    mustache: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/mustache.png', 'base64'),
      chance: 50,
      colorSet: new LightnessDarker(new LightnessBrighter(hairColor, hairColor, 15), skinColor, 5)
    }),
    mouth: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/mouth.png', 'base64'),
      colorSet: new LightnessDarker([new Color('#eec1ad'), new Color('#dbac98'), new Color('#d29985')], skinColor, 5)
    }),
    glasses: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/glasses.png', 'base64'),
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
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/clothes.png', 'base64'),
      colorSet: new ColorSet([
        new Color('#5bc0de'),
        new Color('#5cb85c'),
        new Color('#428bca'),
        new Color('#03396c'),
        new Color('#005b96'),
        new Color('#6497b1'),
        new Color('#1b85b8'),
        new Color('#5a5255'),
        new Color('#559e83'),
        new Color('#ae5a41'),
        new Color('#c3cb71'),
        new Color('#666547'),
        new Color('#ffe28a')
      ])
    }),
    hair: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/hair.png', 'base64'),
      chance: 95,
      colorSet: hairColor
    }),
    hat: new Sprite({
      src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/hats.png', 'base64'),
      chance: 5,
      colorSet: new ColorSet([
        new Color('#18293b'),
        new Color('#2e1e05'),
        new Color('#989789'),
        new Color('#3d6ba7'),
        new Color('#517459'),
        new Color('#a62116')
      ])
    })
  };

  return Promise.resolve(spriteSet);
};

export default maleSpriteSet;
