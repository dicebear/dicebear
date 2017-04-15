"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.pickedColors = {};
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance, callback) {
        var _this = this;
        if (this.colors instanceof Array) {
            process.nextTick(function () {
                _this.pickedColors[chance.seed] = _this.pickedColors[chance.seed] || chance.pickone(_this.colors);
                callback(null, _this.pickedColors[chance.seed]);
            });
        }
        else {
            this.colors.getColor(chance, callback);
        }
    };
    return Color;
}());
exports.default = Color;
