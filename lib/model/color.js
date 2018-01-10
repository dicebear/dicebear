"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hexToRgb = require("pure-color/parse/hex");
var rgbToHsv = require("pure-color/convert/rgb2hsv");
var hsvToRgb = require("pure-color/convert/hsv2rgb");
var Color = /** @class */ (function () {
    function Color(color) {
        if (color instanceof Array) {
            this.rgb = color;
        }
        else {
            this.hex = color;
        }
    }
    Object.defineProperty(Color.prototype, "hsl", {
        /**
         * Get color hsl value
         */
        get: function () {
            return rgbToHsv(this.rgb);
        },
        /**
         * Set color hsl value and calculate rgb
         */
        set: function (hsv) {
            this.rgb = hsvToRgb(hsv);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hex", {
        /**
         * Set color hex value and calculate rgb
         */
        set: function (hex) {
            this.rgb = hexToRgb(hex);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create new color object with same rgb value
     */
    Color.prototype.clone = function () {
        return new Color(this.rgb);
    };
    return Color;
}());
exports.default = Color;
