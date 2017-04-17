"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var objectAssign = require("object-assign");
var async = require("async");
var chance_1 = require("chance");
var Avatars = (function () {
    function Avatars(spriteSet, options) {
        if (options === void 0) { options = {}; }
        this.spriteSet = spriteSet;
    }
    Avatars.prototype.create = function (token, callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        async.each(this.spriteSet, function (sprite, next) {
            sprite.load(next);
        }, function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            var avatarOptions = objectAssign({
                size: 20,
                order: Object.keys(_this.spriteSet)
            }, _this.options, options);
            var chance = new chance_1.Chance(token);
            var canvas = canvas_1.createCanvas();
            var context = canvas.getContext('2d');
            canvas.width = avatarOptions.size;
            canvas.height = avatarOptions.size;
            // Disable image smoothing
            context.imageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.oImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            async.eachSeries(avatarOptions.order, function (spriteName, next) {
                var sprite = _this.spriteSet[spriteName];
                if (sprite) {
                    sprite.create(chance, function (err, image) {
                        if (err) {
                            next(err);
                            return;
                        }
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                        next();
                    });
                }
                else {
                    next(new Error('Sprite ' + spriteName + ' does not exist.'));
                }
            }, function (err) {
                if (err) {
                    callback(err, null);
                }
                var image = canvas_1.createImage();
                image.addEventListener('load', function () {
                    callback(null, image);
                });
                image.addEventListener('error', function (err) {
                    callback(err.error, image);
                });
                image.src = canvas.toDataURL('image/png');
            });
        });
    };
    return Avatars;
}());
exports.default = Avatars;
