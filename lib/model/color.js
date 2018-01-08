"use strict";
/**
 * This file includes Parts of https://github.com/Qix-/color-convert
 *
 * Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
            var r = this.rgb[0] / 255;
            var g = this.rgb[1] / 255;
            var b = this.rgb[2] / 255;
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            var delta = max - min;
            var h, s, l;
            if (max === min) {
                h = 0;
            }
            else if (r === max) {
                h = (g - b) / delta;
            }
            else if (g === max) {
                h = 2 + (b - r) / delta;
            }
            else if (b === max) {
                h = 4 + (r - g) / delta;
            }
            h = Math.min(h * 60, 360);
            if (h < 0) {
                h += 360;
            }
            l = (min + max) / 2;
            if (max === min) {
                s = 0;
            }
            else if (l <= 0.5) {
                s = delta / (max + min);
            }
            else {
                s = delta / (2 - max - min);
            }
            return [h, s * 100, l * 100];
        },
        /**
         * Set color hsl value and calculate rgb
         */
        set: function (hsl) {
            var h = hsl[0] / 360;
            var s = hsl[1] / 100;
            var l = hsl[2] / 100;
            var t1, t2, t3, rgb, val;
            if (s === 0) {
                val = l * 255;
                this.rgb = [val, val, val];
            }
            else {
                if (l < 0.5) {
                    t2 = l * (1 + s);
                }
                else {
                    t2 = l + s - l * s;
                }
                t1 = 2 * l - t2;
                this.rgb = [0, 0, 0];
                for (var i = 0; i < 3; i++) {
                    t3 = h + 1 / 3 * -(i - 1);
                    if (t3 < 0) {
                        t3++;
                    }
                    if (t3 > 1) {
                        t3--;
                    }
                    if (6 * t3 < 1) {
                        val = t1 + (t2 - t1) * 6 * t3;
                    }
                    else if (2 * t3 < 1) {
                        val = t2;
                    }
                    else if (3 * t3 < 2) {
                        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                    }
                    else {
                        val = t1;
                    }
                    this.rgb[i] = val * 255;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hex", {
        /**
         * Set color hex value and calculate rgb
         */
        set: function (hex) {
            var match = hex.match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
            if (!match) {
                this.rgb = [0, 0, 0];
            }
            var colorString = match[0];
            if (match[0].length === 3) {
                colorString = colorString
                    .split('')
                    .map(function (char) {
                    return char + char;
                })
                    .join('');
            }
            var integer = parseInt(colorString, 16);
            var r = (integer >> 16) & 0xff;
            var g = (integer >> 8) & 0xff;
            var b = integer & 0xff;
            this.rgb = [r, g, b];
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
