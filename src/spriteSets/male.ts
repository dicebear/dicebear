import * as fs from 'fs';
import { SpriteSetInterface } from '../spriteSet';
import Sprite from '../sprite';
import Color from '../color';
import BrighterOrDarkerThan from '../color/modifier/brighterOrDarkerThan';

let maleSpriteSet = (chance, callback) => {
    process.nextTick(() => {
        let base64Prefix = 'data:image/png;base64,';

        let skinColor = new Color([
            [255,219,172],
            [241,194,125],
            [224,172,105],
            [198,134,66],
            [141,85,36]
        ]);

        let hairColor = new BrighterOrDarkerThan([
            [9,8,6],
            [44,34,43],
            [113,99,90],
            [183,166,158],
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
        ], skinColor, 12, 12);

        let spriteSet = {
            face: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/face.png', 'base64'),
                color: skinColor
            }),
            eyes: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/eyes.png', 'base64'),
                color: new Color([
                    [118,119,139],
                    [105,123,148],
                    [100,123,144],
                    [91,124,139],
                    [88,131,135]
                ])
            }),
            eyebrows: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/eyebrows.png', 'base64'),
                color: new BrighterOrDarkerThan(
                    new BrighterOrDarkerThan(
                        hairColor,
                        skinColor,
                        0,
                        5
                    ),
                    hairColor,
                    0,
                    7
                )
            }),
            mustache: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/mustache.png', 'base64'),
                chance: 50,
                color: new BrighterOrDarkerThan(
                    new BrighterOrDarkerThan(
                        hairColor,
                        hairColor,
                        15,
                        0
                    ),
                    skinColor,
                    0,
                    5
                )
            }),
            mouth: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/mouth.png', 'base64'),
                color: new BrighterOrDarkerThan([
                    [238,193,173],
                    [219,172,152],
                    [210,153,133]
                ], skinColor, 0, 5)
            }),
            glasses: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/glasses.png', 'base64'),
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
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/clothes.png', 'base64'),
                color: new Color([
                    [91,192,222],
                    [92,184,92],
                    [66,139,202],
                    [3,57,108],
                    [0,91,150],
                    [100,151,177],
                    [27,133,184],
                    [90,82,85],
                    [85,158,131],
                    [174,90,65],
                    [195,203,113],
                    [102,101,71],
                    [255,226,138]
                ])
            }),
            hair: new Sprite({
                src: base64Prefix+fs.readFileSync(__dirname+'/../../assets/male/hair.png', 'base64'),
                chance: 95,
                color: hairColor
            }),
        };

        callback(null, spriteSet);
    });
}

export default maleSpriteSet;