"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("canvas");
function createCanvas() {
    return new canvas_1.default();
}
exports.createCanvas = createCanvas;
function createImage() {
    return new canvas_1.default.Image();
}
exports.createImage = createImage;
