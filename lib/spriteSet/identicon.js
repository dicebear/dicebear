"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var sprite_1 = require("../model/sprite");
var color_1 = require("../model/color");
var colorSet_1 = require("../model/colorSet");
var identiconSpriteSet = function (random) {
    var base64Prefix = 'data:image/png;base64,';
    // Thanks to [Andrew Kensler](http://eastfarthing.com/blog/2016-05-06-palette/)
    var color = new colorSet_1.default([
        new color_1.default('#d6a090'),
        new color_1.default('#fe3b1e'),
        new color_1.default('#a12c32'),
        new color_1.default('#fa2f7a'),
        new color_1.default('#fb9fda'),
        new color_1.default('#e61cf7'),
        new color_1.default('#992f7c'),
        new color_1.default('#47011f'),
        new color_1.default('#051155'),
        new color_1.default('#4f02ec'),
        new color_1.default('#2d69cb'),
        new color_1.default('#00a6ee'),
        new color_1.default('#6febff'),
        new color_1.default('#08a29a'),
        new color_1.default('#2a666a'),
        new color_1.default('#063619'),
        new color_1.default('#4a4957'),
        new color_1.default('#8e7ba4'),
        new color_1.default('#b7c0ff'),
        new color_1.default('#acbe9c'),
        new color_1.default('#827c70'),
        new color_1.default('#5a3b1c'),
        new color_1.default('#ae6507'),
        new color_1.default('#f7aa30'),
        new color_1.default('#f4ea5c'),
        new color_1.default('#9b9500'),
        new color_1.default('#566204'),
        new color_1.default('#11963b'),
        new color_1.default('#51e113'),
        new color_1.default('#08fdcc')
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
