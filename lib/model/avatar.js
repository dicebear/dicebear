"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("../helper/canvas");
var Avatar = /** @class */ (function () {
    function Avatar(canvas) {
        this.canvas = canvas;
    }
    Avatar.prototype.resize = function (size) {
        var canvas = canvas_1.createCanvas();
        canvas.width = size;
        canvas.height = size;
        var context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.drawImage(this.canvas, 0, 0, size, size);
        return new Avatar(canvas);
    };
    Object.defineProperty(Avatar.prototype, "dataUrl", {
        get: function () {
            return this.canvas.toDataURL();
        },
        enumerable: true,
        configurable: true
    });
    return Avatar;
}());
exports.default = Avatar;
