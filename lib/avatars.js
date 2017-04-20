"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var objectAssign = require("object-assign");
var async = require("async");
var chance_1 = require("chance");
var Avatars = (function () {
    /**
     * @param spriteSet
     * @param options
     */
    function Avatars(spriteSet, options) {
        if (options === void 0) { options = {}; }
        this.spriteSet = spriteSet;
        this.options = options;
    }
    /**
     * Creates an avatar
     *
     * @param token
     * @param options
     * @param callback
     */
    Avatars.prototype.create = function (token, options, callback) {
        var _this = this;
        var chance = new chance_1.Chance(token);
        this.spriteSet(chance, function (err, spriteSet) {
            async.each(spriteSet, function (sprite, next) {
                sprite.load(next);
            }, function (err) {
                if (err) {
                    callback(err, null, chance);
                    return;
                }
                var avatarOptions = objectAssign({
                    size: 20,
                    order: Object.keys(spriteSet)
                }, _this.options, options);
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
                    var sprite = spriteSet[spriteName];
                    if (sprite) {
                        sprite.create(chance, function (err, spriteCanvas) {
                            if (err) {
                                next(err);
                                return;
                            }
                            context.drawImage(spriteCanvas, 0, 0, canvas.width, canvas.height);
                            next();
                        });
                    }
                    else {
                        next(new Error('Sprite ' + spriteName + ' does not exist.'));
                    }
                }, function (err) {
                    callback(err, canvas, chance);
                });
            });
        });
    };
    return Avatars;
}());
exports.default = Avatars;
