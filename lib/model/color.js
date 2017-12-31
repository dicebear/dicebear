"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var oneColor = require("onecolor");
var Color = /** @class */ (function () {
    function Color(color) {
        this.color = oneColor(color);
    }
    Color.prototype.rgb = function () {
        return this.color.rgb();
    };
    Color.prototype.hsl = function () {
        return this.color.hsl();
    };
    Color.prototype.clone = function () {
        return new Color(this.color.hex());
    };
    return Color;
}());
exports.default = Color;
