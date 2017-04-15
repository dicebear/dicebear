import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../sprite';
import Color from '../color';
import DarkerThanColor from '../color/modifier/darkerThan';

let skinColor = new Color([
    [255,219,172],
    [241,194,125],
    [224,172,105],
    [198,134,66],
    [141,85,36]
]);

let spriteSet: SpriteSetInterface = {
    face: new Sprite({
        src: './assets/female/face.png',
        color: skinColor
    }),
    mouth: new Sprite({
        src: './assets/female/mouth.png',
        color: new DarkerThanColor([
            [219,172,152],
            [210,153,133],
            [201,130,118],
            [227,93,106],
            [227, 33, 83],
            [222, 15, 13]
        ], skinColor, .05)
    }),
    eyes: new Sprite({
        src: './assets/female/eyes.png',
        color: new Color([
            [118,119,139],
            [105,123,148],
            [100,123,144],
            [91,124,139],
            [88,131,135]
        ])
    }),
    eyebrows: new Sprite({
        src: './assets/female/eyebrows.png',
        color: new Color([
            [50,50,50]
        ])
    }),
    accessories: new Sprite({
        src: './assets/female/accessories.png',
        chance: 15,
        color: new Color([
            [218,165,32],
            [255,215,0],
            [238,232,170],
            [250,250,210],
            [211,211,211],
            [169,169,169]
        ])
    }),
    glasses: new Sprite({
        src: './assets/female/glasses.png',
        chance: 25,
        color: new Color([
            [95,112,92],
            [67,103,125],
            [94,23,45],
            [255,182,122],
            [160,75,93],
            [25,25,25],
            [50,50,50],
            [75,75,75]
        ])
    }),
    clothes: new Sprite({
        src: './assets/female/clothes.png',
        color: new Color([
            [209,17,65],
            [0,177,89],
            [0,174,219],
            [243,119,53],
            [255,196,37],
            [116,0,1],
            [174,0,1],
            [238,186,48],
            [150,206,180],
            [255,238,173],
            [255,111,105],
            [255,204,92],
            [136,216,176]
        ])
    }),
    hair: new Sprite({
        src: './assets/female/hair.png',
        chance: 95,
        color: new Color([
            [9,8,6],
            [44,34,43],
            [113,99,90],
            [183,166,158],
            [214,196,194],
            [202,191,177],
            [220,208,186],
            [255,245,225],
            [230,206,168],
            [229,200,168],
            [222,188,153],
            [184,151,120],
            [165,107,70],
            [181,82,57],
            [141,74,67],
            [145,85,61],
            [83,61,50],
            [59,48,36],
            [85,72,56],
            [78,67,63],
            [80,68,68],
            [106,78,66],
            [167,133,106],
            [151,121,97]
        ])
    }),
}

export default spriteSet;