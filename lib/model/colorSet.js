"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorSet = /** @class */ (function () {
    /**
     * @param colors
     */
    function ColorSet(colors) {
        this.pickedColors = {};
        this.colors = colors;
    }
    /**
     * Returns a color
     *
     * @param random
     */
    ColorSet.prototype.getColor = function (random) {
        if (this.colors instanceof ColorSet) {
            return this.colors.getColor(random);
        }
        else {
            return (this.pickedColors[random.seed] = this.pickedColors[random.seed] || random.pickone(this.colors));
        }
    };
    return ColorSet;
}());
exports.default = ColorSet;
