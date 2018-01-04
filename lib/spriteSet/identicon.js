"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sprite_1 = require("../model/sprite");
var color_1 = require("../model/color");
var colorSet_1 = require("../model/colorSet");
var identiconSpriteSet = function (random) {
    var base64Prefix = 'data:image/png;base64,';
    // Thanks to [materialui.co](https://www.materialui.co/colors)
    var color = new colorSet_1.default([
        new color_1.default('#e57373'),
        new color_1.default('#F06292'),
        new color_1.default('#BA68C8'),
        new color_1.default('#9575CD'),
        new color_1.default('#7986CB'),
        new color_1.default('#64B5F6'),
        new color_1.default('#4FC3F7'),
        new color_1.default('#4DD0E1'),
        new color_1.default('#4DB6AC'),
        new color_1.default('#81C784'),
        new color_1.default('#AED581'),
        new color_1.default('#DCE775'),
        new color_1.default('#FFF176'),
        new color_1.default('#FFD54F'),
        new color_1.default('#FFB74D'),
        new color_1.default('#FF8A65')
    ]);
    var spriteSet = {
        1: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/1.png', 'base64'),
            colorSet: color
        }),
        2: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/2.png', 'base64'),
            colorSet: color
        }),
        3: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/3.png', 'base64'),
            colorSet: color
        }),
        4: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/4.png', 'base64'),
            colorSet: color
        }),
        5: new sprite_1.default({
            src: base64Prefix + fs.readFileSync(__dirname + '/../../assets/identicon/5.png', 'base64'),
            colorSet: color
        })
    };
    return Promise.resolve(spriteSet);
};
exports.default = identiconSpriteSet;
