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
var brighter_1 = require("./brighter");
var darker_1 = require("./darker");
/**
 * Ensures that the selected color is darker or brighter than a reference color.
 */
var BrighterOrDarkerThan = /** @class */ (function (_super) {
    __extends(BrighterOrDarkerThan, _super);
    /**
     * @param colors
     * @param reference
     * @param difference
     */
    function BrighterOrDarkerThan(colors, reference, difference) {
        var _this = _super.call(this, colors) || this;
        _this.reference = reference;
        _this.brighter = new brighter_1.default(colors, reference, difference);
        _this.darker = new darker_1.default(colors, reference, difference);
        return _this;
    }
    /**
     * Returns a color
     *
     * @param random
     */
    BrighterOrDarkerThan.prototype.getColor = function (random) {
        var color = _super.prototype.getColor.call(this, random);
        var referenceColor = this.reference.getColor(random);
        var colorHsl = color.hsl;
        var referenceColorHsl = referenceColor.hsl;
        if (colorHsl[2] <= referenceColorHsl[2]) {
            return this.brighter.getColor(random);
        }
        else {
            return this.darker.getColor(random);
        }
    };
    return BrighterOrDarkerThan;
}(colorSet_1.default));
exports.default = BrighterOrDarkerThan;
