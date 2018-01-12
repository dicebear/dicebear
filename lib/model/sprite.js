"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("../helper/canvas");
var Sprite = /** @class */ (function () {
    /**
     * @param options
     */
    function Sprite(options) {
        this.image = null;
        this.imageError = null;
        this.imageSprites = null;
        // Set default options
        options.chance = options.chance || 100;
        this.options = options;
    }
    /**
     * Loads sprite Image
     */
    Sprite.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (null === _this.image) {
                // Create HTMLImageElement
                _this.image = canvas_1.createImage();
                _this.image.addEventListener('load', function () {
                    _this.imageSprites = Math.floor(_this.image.width / _this.image.height);
                });
                _this.image.addEventListener('error', function (err) {
                    _this.imageError = err.error;
                });
            }
            if (_this.image.src && _this.image.complete) {
                _this.imageError ? reject(_this.imageError) : resolve(_this.image);
            }
            else {
                _this.image.addEventListener('load', function () { return resolve(_this.image); });
                _this.image.addEventListener('error', function (err) { return reject(err.error); });
                _this.image.src = _this.options.src;
            }
        });
    };
    /**
     * Creates an sprite
     *
     * @param random
     */
    Sprite.prototype.create = function (random) {
        if (!this.image.complete) {
            throw new Error('Sprite image not loaded.');
        }
        var canvas = canvas_1.createCanvas();
        var context = canvas.getContext('2d');
        canvas.width = this.image.height;
        canvas.height = this.image.height;
        if (random.bool(this.options.chance)) {
            var color = this.options.colorSet.getColor(random);
            context.drawImage(this.image, random.integer(0, this.imageSprites - 1) * this.image.height * -1, 0);
            this.tintCanvas(canvas, color);
            return canvas;
        }
        else {
            return canvas;
        }
    };
    /**
     * Tints an sprite
     *
     * @param canvas
     * @param color
     */
    Sprite.prototype.tintCanvas = function (canvas, color) {
        var context = canvas.getContext('2d');
        var buffer = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < buffer.data.length; i += 4) {
            var r = i;
            var g = i + 1;
            var b = i + 2;
            var a = i + 3;
            if (a > 0) {
                buffer.data[r] = Math.round((buffer.data[r] - color.rgb[0]) * (buffer.data[r] / 255) + color.rgb[0]);
                buffer.data[g] = Math.round((buffer.data[g] - color.rgb[1]) * (buffer.data[g] / 255) + color.rgb[1]);
                buffer.data[b] = Math.round((buffer.data[b] - color.rgb[2]) * (buffer.data[b] / 255) + color.rgb[2]);
            }
        }
        context.putImageData(buffer, 0, 0);
    };
    return Sprite;
}());
exports.default = Sprite;
