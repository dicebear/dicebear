"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sprite_1 = require("../sprite");
var color_1 = require("../color");
var brighterOrDarkerThan_1 = require("../color/modifier/brighterOrDarkerThan");
var base64Prefix = 'data:image/png;base64,';
var skinColor = new color_1.default([
    [255, 219, 172],
    [241, 194, 125],
    [224, 172, 105],
    [198, 134, 66],
    [141, 85, 36]
]);
var hairColor = new brighterOrDarkerThan_1.default([
    [9, 8, 6],
    [44, 34, 43],
    [113, 99, 90],
    [183, 166, 158],
    [214, 196, 194],
    [202, 191, 177],
    [220, 208, 186],
    [255, 245, 225],
    [230, 206, 168],
    [229, 200, 168],
    [222, 188, 153],
    [184, 151, 120],
    [165, 107, 70],
    [181, 82, 57],
    [141, 74, 67],
    [145, 85, 61],
    [83, 61, 50],
    [59, 48, 36],
    [85, 72, 56],
    [78, 67, 63],
    [80, 68, 68],
    [106, 78, 66],
    [167, 133, 106],
    [151, 121, 97]
], skinColor, 12, 12);
var spriteSet = {
    face: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/face.png', 'base64'),
        color: skinColor
    }),
    eyes: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/eyes.png', 'base64'),
        color: new color_1.default([
            [118, 119, 139],
            [105, 123, 148],
            [100, 123, 144],
            [91, 124, 139],
            [88, 131, 135]
        ])
    }),
    eyebrows: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/eyebrows.png', 'base64'),
        color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, skinColor, 0, 5), hairColor, 0, 7)
    }),
    mouth: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/mouth.png', 'base64'),
        color: new brighterOrDarkerThan_1.default([
            [219, 172, 152],
            [210, 153, 133],
            [201, 130, 118],
            [227, 93, 106],
            [227, 33, 83],
            [222, 15, 13]
        ], skinColor, 0, 5)
    }),
    accessories: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/accessories.png', 'base64'),
        chance: 15,
        color: new color_1.default([
            [218, 165, 32],
            [255, 215, 0],
            [238, 232, 170],
            [250, 250, 210],
            [211, 211, 211],
            [169, 169, 169]
        ])
    }),
    glasses: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/glasses.png', 'base64'),
        chance: 25,
        color: new color_1.default([
            [95, 112, 92],
            [67, 103, 125],
            [94, 23, 45],
            [255, 182, 122],
            [160, 75, 93],
            [25, 25, 25],
            [50, 50, 50],
            [75, 75, 75]
        ])
    }),
    clothes: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/clothes.png', 'base64'),
        color: new color_1.default([
            [209, 17, 65],
            [0, 177, 89],
            [0, 174, 219],
            [243, 119, 53],
            [255, 196, 37],
            [116, 0, 1],
            [174, 0, 1],
            [238, 186, 48],
            [150, 206, 180],
            [255, 238, 173],
            [255, 111, 105],
            [255, 204, 92],
            [136, 216, 176]
        ])
    }),
    hair: new sprite_1.default({
        src: base64Prefix + fs.readFileSync('./assets/female/hair.png', 'base64'),
        chance: 95,
        color: hairColor
    }),
};
exports.default = spriteSet;
