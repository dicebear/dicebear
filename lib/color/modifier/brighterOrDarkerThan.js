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
var color_1 = require("../../color");
var OneColor = require("onecolor");
var BrighterOrDarkerThan = (function (_super) {
    __extends(BrighterOrDarkerThan, _super);
    function BrighterOrDarkerThan(colors, referenceColor, differenceBrightness, differenceDarkness) {
        var _this = _super.call(this, colors) || this;
        _this.referenceColor = referenceColor;
        _this.differenceBrightness = differenceBrightness ? differenceBrightness / 100 : 0;
        _this.differenceDarkness = differenceDarkness ? differenceDarkness / 100 : 0;
        return _this;
    }
    BrighterOrDarkerThan.prototype.getColor = function (chance, callback) {
        var _this = this;
        _super.prototype.getColor.call(this, chance, function (err, color) {
            _this.referenceColor.getColor(chance, function (err, referenceColor) {
                var hslColor = new OneColor.color([color[0], color[1], color[2], 255]).hsl(); // 50
                var hslReferenceColor = new OneColor.color([referenceColor[0], referenceColor[1], referenceColor[2], 255]).hsl(); // 45
                var minBrightness = hslReferenceColor.lightness() + _this.differenceBrightness; // 55
                var minDarkness = hslReferenceColor.lightness() - _this.differenceDarkness; // 35
                if (_this.differenceBrightness &&
                    minBrightness > hslColor.lightness() &&
                    (0 == _this.differenceDarkness || hslReferenceColor.lightness() < hslColor.lightness())) {
                    hslColor = hslColor.lightness(minBrightness);
                }
                if (_this.differenceDarkness &&
                    minDarkness < hslColor.lightness() &&
                    (0 == _this.differenceBrightness || hslReferenceColor.lightness() > hslColor.lightness())) {
                    hslColor = hslColor.lightness(minDarkness);
                }
                var rgbColor = hslColor.rgb();
                callback(err, [rgbColor.red() * 255, rgbColor.green() * 255, rgbColor.blue() * 255]);
            });
        });
    };
    return BrighterOrDarkerThan;
}(color_1.default));
exports.default = BrighterOrDarkerThan;
