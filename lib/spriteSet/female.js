"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sprite_1 = require("../model/sprite");
var color_1 = require("../model/color");
var colorSet_1 = require("../model/colorSet");
var difference_1 = require("../color/modifier/lightness/difference");
var darker_1 = require("../color/modifier/lightness/darker");
var femaleSpriteSet = function (random) {
    var base64Prefix = 'data:image/png;base64,';
    var skinColor = new colorSet_1.default([
        new color_1.default('#ffdbac'),
        new color_1.default('#f1c27d'),
        new color_1.default('#e0ac69'),
        new color_1.default('#c68642'),
        new color_1.default('#8d5524')
    ]);
    var hairColor = new difference_1.default(new colorSet_1.default([
        new color_1.default('#090806'),
        new color_1.default('#2c222b'),
        new color_1.default('#71635a'),
        new color_1.default('#b7a69e'),
        new color_1.default('#d6c4c2'),
        new color_1.default('#cabfb1'),
        new color_1.default('#dcd0ba'),
        new color_1.default('#fff5e1'),
        new color_1.default('#e6cea8'),
        new color_1.default('#e5c8a8'),
        new color_1.default('#debc99'),
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
    ]), skinColor, 12);
    var spriteSet = {
        face: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/face.png', 'base64'),
            colorSet: skinColor
        }),
        eyes: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/eyes.png', 'base64'),
            colorSet: new colorSet_1.default([
                new color_1.default('#76778b'),
                new color_1.default('#697b94'),
                new color_1.default('#647b90'),
                new color_1.default('#5b7c8b'),
                new color_1.default('#588387')
            ])
        }),
        eyebrows: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/eyebrows.png', 'base64'),
            colorSet: new darker_1.default(new darker_1.default(hairColor, skinColor, 5), hairColor, 7)
        }),
        mouth: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/mouth.png', 'base64'),
            colorSet: new darker_1.default([
                new color_1.default('#dbac98'),
                new color_1.default('#d29985'),
                new color_1.default('#c98276'),
                new color_1.default('#e35d6a'),
                new color_1.default('#e32153'),
                new color_1.default('#de0f0d')
            ], skinColor, 5)
        }),
        accessories: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/accessories.png', 'base64'),
            chance: 15,
            colorSet: new colorSet_1.default([
                new color_1.default('#daa520'),
                new color_1.default('#ffd700'),
                new color_1.default('#eee8aa'),
                new color_1.default('#fafad2'),
                new color_1.default('#d3d3d3'),
                new color_1.default('#a9a9a9')
            ])
        }),
        glasses: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/glasses.png', 'base64'),
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
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/clothes.png', 'base64'),
            colorSet: new colorSet_1.default([
                new color_1.default('#d11141'),
                new color_1.default('#00b159'),
                new color_1.default('#00aedb'),
                new color_1.default('#f37735'),
                new color_1.default('#ffc425'),
                new color_1.default('#740001'),
                new color_1.default('#ae0001'),
                new color_1.default('#eeba30'),
                new color_1.default('#96ceb4'),
                new color_1.default('#ffeead'),
                new color_1.default('#ff6f69'),
                new color_1.default('#ffcc5c'),
                new color_1.default('#88d8b0')
            ])
        }),
        hair: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/hair.png', 'base64'),
            chance: 95,
            colorSet: hairColor
        }),
        hat: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/female/hats.png', 'base64'),
            chance: 5,
            colorSet: new colorSet_1.default([
                new color_1.default('#cc6192'),
                new color_1.default('#2663a3'),
                new color_1.default('#a62116'),
                new color_1.default('#3d8a6b'),
                new color_1.default('#614f8a')
            ])
        })
    };
    return Promise.resolve(spriteSet);
};
exports.default = femaleSpriteSet;
