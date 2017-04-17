"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sprite_1 = require("../sprite");
var color_1 = require("../color");
var brighterOrDarkerThan_1 = require("../color/modifier/brighterOrDarkerThan");
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
        src: './assets/male/face.png',
        color: skinColor
    }),
    eyes: new sprite_1.default({
        src: './assets/male/eyes.png',
        color: new color_1.default([
            [118, 119, 139],
            [105, 123, 148],
            [100, 123, 144],
            [91, 124, 139],
            [88, 131, 135]
        ])
    }),
    eyebrows: new sprite_1.default({
        src: './assets/male/eyebrows.png',
        color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, skinColor, 0, 5), hairColor, 0, 7)
    }),
    mustache: new sprite_1.default({
        src: './assets/male/mustache.png',
        chance: 50,
        color: new brighterOrDarkerThan_1.default(new brighterOrDarkerThan_1.default(hairColor, hairColor, 15, 0), skinColor, 0, 5)
    }),
    mouth: new sprite_1.default({
        src: './assets/male/mouth.png',
        color: new brighterOrDarkerThan_1.default([
            [238, 193, 173],
            [219, 172, 152],
            [210, 153, 133]
        ], skinColor, 0, 5)
    }),
    glasses: new sprite_1.default({
        src: './assets/male/glasses.png',
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
        src: './assets/male/clothes.png',
        color: new color_1.default([
            [91, 192, 222],
            [92, 184, 92],
            [66, 139, 202],
            [3, 57, 108],
            [0, 91, 150],
            [100, 151, 177],
            [27, 133, 184],
            [90, 82, 85],
            [85, 158, 131],
            [174, 90, 65],
            [195, 203, 113],
            [102, 101, 71],
            [255, 226, 138]
        ])
    }),
    hair: new sprite_1.default({
        src: './assets/male/hair.png',
        chance: 95,
        color: hairColor
    }),
};
exports.default = spriteSet;
