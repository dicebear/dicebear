"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance) {
        return this.pickedColors[chance.seed] = this.pickedColors[chance.seed] || chance.pickone(this.colors);
    };
    return Color;
}());
exports.default = Color;
