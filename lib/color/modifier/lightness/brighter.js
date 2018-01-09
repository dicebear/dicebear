"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var colorSet_1 = require("../../../model/colorSet");
/**
 * Ensures that the selected color is lighter than a reference color.
 */
var BrighterOrDarkerThan = /** @class */ (function (_super) {
    __extends(BrighterOrDarkerThan, _super);
    function BrighterOrDarkerThan(colors, reference, difference) {
        var _this = _super.call(this, colors) || this;
        _this.reference = reference;
        _this.difference = difference;
        return _this;
    }
    BrighterOrDarkerThan.prototype.getColor = function (random) {
        var color = _super.prototype.getColor.call(this, random);
        var referenceColor = this.reference.getColor(random);
        var colorHsl = color.hsl;
        var referenceColorHsl = referenceColor.hsl;
        if (colorHsl[2] >= referenceColorHsl[2] + this.difference) {
            return color;
        }
        colorHsl[2] = colorHsl[2] + this.difference;
        if (colorHsl[2] > 100) {
            colorHsl[2] = 100;
        }
        var brighterColor = color.clone();
        brighterColor.hsl = colorHsl;
        return brighterColor;
    };
    return BrighterOrDarkerThan;
}(colorSet_1.default));
exports.default = BrighterOrDarkerThan;
