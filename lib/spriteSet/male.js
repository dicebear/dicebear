"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sprite_1 = require("../model/sprite");
var color_1 = require("../model/color");
var colorSet_1 = require("../model/colorSet");
var difference_1 = require("../color/modifier/lightness/difference");
var brighter_1 = require("../color/modifier/lightness/brighter");
var darker_1 = require("../color/modifier/lightness/darker");
var maleSpriteSet = function (random) {
    var base64Prefix = 'data:image/png;base64,';
    var skinColor = new colorSet_1.default([
        new color_1.default('#ffdbac'),
        new color_1.default('#f1c27d'),
        new color_1.default('#e0ac69'),
        new color_1.default('#c68642'),
        new color_1.default('#8d5524')
    ]);
    var hairColor = new difference_1.default([
        new color_1.default('#090806'),
        new color_1.default('#2c222b'),
        new color_1.default('#71635a'),
        new color_1.default('#b7a69e'),
        new color_1.default('#b89778'),
        new color_1.default('#a56b46'),
        new color_1.default('#b55239'),
        new color_1.default('#8d4a43'),
        new color_1.default('#91553d'),
        new color_1.default('#533d32'),
        new color_1.default('#3b3024'),
        new color_1.default('#554838'),
        new color_1.default('#4e433f'),
        new color_1.default('#504444'),
        new color_1.default('#6a4e42'),
        new color_1.default('#a7856a'),
        new color_1.default('#977961')
    ], skinColor, 12);
    var spriteSet = {
        face: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/face.png', 'base64'),
            colorSet: skinColor
        }),
        eyes: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/eyes.png', 'base64'),
            colorSet: new colorSet_1.default([
                new color_1.default('#76778b'),
                new color_1.default('#697b94'),
                new color_1.default('#647b90'),
                new color_1.default('#5b7c8b'),
                new color_1.default('#588387')
            ])
        }),
        eyebrows: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/eyebrows.png', 'base64'),
            colorSet: new darker_1.default(new darker_1.default(hairColor, skinColor, 5), hairColor, 7)
        }),
        mustache: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/mustache.png', 'base64'),
            chance: 50,
            colorSet: new darker_1.default(new brighter_1.default(hairColor, hairColor, 15), skinColor, 5)
        }),
        mouth: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/mouth.png', 'base64'),
            colorSet: new darker_1.default([new color_1.default('#eec1ad'), new color_1.default('#dbac98'), new color_1.default('#d29985')], skinColor, 5)
        }),
        glasses: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/glasses.png', 'base64'),
            chance: 25,
            colorSet: new colorSet_1.default([
                new color_1.default('#5f705c'),
                new color_1.default('#43677d'),
                new color_1.default('#5e172d'),
                new color_1.default('#ffb67a'),
                new color_1.default('#a04b5d'),
                new color_1.default('#191919'),
                new color_1.default('#323232'),
                new color_1.default('#4b4b4b')
            ])
        }),
        clothes: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/clothes.png', 'base64'),
            colorSet: new colorSet_1.default([
                new color_1.default('#5bc0de'),
                new color_1.default('#5cb85c'),
                new color_1.default('#428bca'),
                new color_1.default('#03396c'),
                new color_1.default('#005b96'),
                new color_1.default('#6497b1'),
                new color_1.default('#1b85b8'),
                new color_1.default('#5a5255'),
                new color_1.default('#559e83'),
                new color_1.default('#ae5a41'),
                new color_1.default('#c3cb71'),
                new color_1.default('#666547'),
                new color_1.default('#ffe28a')
            ])
        }),
        hair: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/hair.png', 'base64'),
            chance: 95,
            colorSet: hairColor
        }),
        hat: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/male/hats.png', 'base64'),
            chance: 5,
            colorSet: new colorSet_1.default([
                new color_1.default('#18293b'),
                new color_1.default('#2e1e05'),
                new color_1.default('#989789'),
                new color_1.default('#3d6ba7'),
                new color_1.default('#517459'),
                new color_1.default('#a62116')
            ])
        })
    };
    return Promise.resolve(spriteSet);
};
exports.default = maleSpriteSet;
