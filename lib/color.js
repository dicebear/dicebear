"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance) {
        return chance.pickone(this.colors);
    };
    return Color;
}());
exports.default = Color;
