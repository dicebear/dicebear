"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Avatar = /** @class */ (function () {
    function Avatar(canvas) {
        this.canvas = canvas;
    }
    Object.defineProperty(Avatar.prototype, "dataUrl", {
        get: function () {
            return this.canvas.toDataURL();
        },
        enumerable: true,
        configurable: true
    });
    return Avatar;
}());
exports.default = Avatar;
