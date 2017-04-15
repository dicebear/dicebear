"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.pickedColors = {};
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance, callback) {
        var _this = this;
        process.nextTick(function () {
            _this.pickedColors[chance.seed] = _this.pickedColors[chance.seed] || chance.pickone(_this.colors);
            callback(null, _this.pickedColors[chance.seed]);
        });
    };
    return Color;
}());
exports.default = Color;
