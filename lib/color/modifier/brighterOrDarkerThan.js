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
var colorSet_1 = require("../../model/colorSet");
var BrighterOrDarkerThan = /** @class */ (function (_super) {
    __extends(BrighterOrDarkerThan, _super);
    /**
     * @param colors
     * @param referenceColor
     * @param differenceBrightness
     * @param differenceDarkness
     */
    function BrighterOrDarkerThan(colors, referenceColor, differenceBrightness, differenceDarkness) {
        var _this = _super.call(this, colors) || this;
        _this.referenceColor = referenceColor;
        _this.differenceBrightness = differenceBrightness ? differenceBrightness / 100 : 0;
        _this.differenceDarkness = differenceDarkness ? differenceDarkness / 100 : 0;
        return _this;
    }
    /**
     * Returns a color
     *
     * @param random
     */
    BrighterOrDarkerThan.prototype.getColor = function (random) {
        var _this = this;
        return Promise.all([_super.prototype.getColor.call(this, random), this.referenceColor.getColor(random)]).then(function (_a) {
            var color = _a[0], referenceColor = _a[1];
            var hslColor = color.hsl;
            var hslReferenceColor = referenceColor.hsl;
            var lightness = hslColor[2];
            var referenceLightness = hslReferenceColor[2];
            var minBrightness = referenceLightness + _this.differenceBrightness;
            var minDarkness = referenceLightness - _this.differenceDarkness;
            if (_this.differenceBrightness &&
                minBrightness > lightness &&
                (0 == _this.differenceDarkness || referenceLightness < lightness)) {
                hslColor[2] = minBrightness;
            }
            if (_this.differenceDarkness &&
                minDarkness < lightness &&
                (0 == _this.differenceBrightness || referenceLightness > lightness)) {
                hslColor[2] = minDarkness;
            }
            var newColor = color.clone();
            newColor.hsl = hslColor;
            return newColor;
        });
    };
    return BrighterOrDarkerThan;
}(colorSet_1.default));
exports.default = BrighterOrDarkerThan;
