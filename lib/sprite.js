"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var Sprite = (function () {
    function Sprite(options) {
        this.image = null;
        this.imageError = null;
        this.imageSprites = null;
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;
        this.options = options;
    }
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
    Sprite.prototype.create = function (chance, callback) {
        var _this = this;
        if (!this.image.complete) {
            process.nextTick(function () { return callback(new Error('Sprite image not loaded.'), null); });
            return;
        }
        if (this.createdImages[chance.seed]) {
            process.nextTick(function () { return callback(null, _this.createdImages[chance.seed]); });
            return;
        }
        var canvas = canvas_1.createCanvas();
        var context = canvas.getContext('2d');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        if (chance.bool({ likelihood: this.options.chance })) {
            context.drawImage(this.image, chance.natural({ min: 0, max: this.imageSprites - 1 }) * this.options.size * -1, 0);
            var color = this.options.color.getColor(chance);
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
        }
        var sprite = canvas_1.createImage();
        sprite.addEventListener('load', function () {
            _this.createdImages[chance.seed] = sprite;
            callback(null, sprite);
        });
        sprite.addEventListener('error', function (err) {
            callback(err.error, sprite);
        });
        sprite.src = canvas.toDataURL('image/png');
    };
    return Sprite;
}());
exports.default = Sprite;
