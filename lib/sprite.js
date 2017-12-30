"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var Sprite = /** @class */ (function () {
    /**
     * @param options
     */
    function Sprite(options) {
        this.image = null;
        this.imageError = null;
        this.imageSprites = null;
        this.createdCanvases = {};
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;
        this.options = options;
    }
    /**
     * Loads sprite Image
     *
     * @param callback
     */
    Sprite.prototype.load = function (callback) {
        var _this = this;
        if (null === this.image) {
            // Create HTMLImageElement
            this.image = canvas_1.createImage();
            this.image.addEventListener('load', function () {
                _this.imageSprites = Math.floor(_this.image.width / _this.options.size);
            });
            this.image.addEventListener('error', function (err) {
                _this.imageError = err.error;
            });
        }
        if (this.image.src && this.image.complete) {
            process.nextTick(function () { return callback(_this.imageError, _this.image); });
        }
        else {
            this.image.addEventListener('load', function () {
                callback(null, _this.image);
            });
            this.image.addEventListener('error', function (err) {
                callback(err.error, _this.image);
            });
        }
        if (!this.image.src) {
            this.image.src = this.options.src;
        }
    };
    /**
     * Creates an sprite
     *
     * @param chance
     * @param callback
     */
    Sprite.prototype.create = function (chance, callback) {
        var _this = this;
        if (!this.image.complete) {
            process.nextTick(function () { return callback(new Error('Sprite image not loaded.'), null); });
            return;
        }
        if (this.createdCanvases[chance.seed]) {
            process.nextTick(function () { return callback(null, _this.createdCanvases[chance.seed]); });
            return;
        }
        var canvas = canvas_1.createCanvas();
        var context = canvas.getContext('2d');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        if (chance.bool({ likelihood: this.options.chance })) {
            this.options.color.getColor(chance, function (err, color) {
                context.drawImage(_this.image, chance.natural({ min: 0, max: _this.imageSprites - 1 }) * _this.options.size * -1, 0);
                _this.tintCanvas(canvas, color, function (err) {
                    callback(null, canvas);
                });
            });
        }
        else {
            process.nextTick(function () { return callback(null, canvas); });
        }
    };
    /**
     * Tints an sprite
     *
     * @param canvas
     * @param color
     * @param callback
     */
    Sprite.prototype.tintCanvas = function (canvas, color, callback) {
        var context = canvas.getContext('2d');
        var buffer = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < buffer.data.length; i += 4) {
            var r = i;
            var g = i + 1;
            var b = i + 2;
            var a = i + 3;
            if (a > 0) {
                buffer.data[r] = Math.round((buffer.data[r] - color[0]) * (buffer.data[r] / 255) + color[0]);
                buffer.data[g] = Math.round((buffer.data[g] - color[1]) * (buffer.data[g] / 255) + color[1]);
                buffer.data[b] = Math.round((buffer.data[b] - color[2]) * (buffer.data[b] / 255) + color[2]);
            }
        }
        context.putImageData(buffer, 0, 0);
        process.nextTick(function () { return callback(null); });
    };
    return Sprite;
}());
exports.default = Sprite;
