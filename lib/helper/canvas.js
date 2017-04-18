"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Canvas = require("canvas");
function createCanvas() {
    return new Canvas();
}
exports.createCanvas = createCanvas;
function createImage() {
    var image = new Canvas.Image();
    image.eventListener = {
        load: [],
        error: []
    };
    image.addEventListener = function (event, callback) {
        image.eventListener[event].push(callback);
    };
    image.onload = function () {
        image.eventListener.load.forEach(function (callback) {
            callback();
        });
        image.eventListener.load = [];
    };
    image.onerror = function (err) {
        image.eventListener.error.forEach(function (callback) {
            callback(err);
        });
        image.eventListener.error = [];
    };
    return image;
}
exports.createImage = createImage;
