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
var DarkerThan = (function (_super) {
    __extends(DarkerThan, _super);
    function DarkerThan(colors, referenceColor, difference) {
        var _this = _super.call(this, colors) || this;
        _this.referenceColor = referenceColor;
        _this.difference = difference;
        return _this;
    }
    DarkerThan.prototype.getColor = function (chance, callback) {
        var _this = this;
        _super.prototype.getColor.call(this, chance, function (err, color) {
            _this.referenceColor.getColor(chance, function (err, referenceColor) {
                var hslColor = new OneColor.color([color[0], color[1], color[2], 255]).hsl();
                var hslReferenceColor = new OneColor.color([referenceColor[0], referenceColor[1], referenceColor[2], 255]).hsl();
                if (hslReferenceColor.lightness() - _this.difference < hslColor.lightness()) {
                    hslColor = hslColor.lightness(hslReferenceColor.lightness() - _this.difference);
                }
                var rgbColor = hslColor.rgb();
                callback(err, [rgbColor.red() * 255, rgbColor.green() * 255, rgbColor.blue() * 255]);
            });
        });
    };
    return DarkerThan;
}(color_1.default));
exports.default = DarkerThan;
