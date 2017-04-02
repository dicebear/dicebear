"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require("process");
var chance_1 = require("./helper/chance");
var Color = (function () {
    function Color(colors) {
        this.color = chance_1.pickone(colors);
    }
    Color.prototype.getColor = function (callback) {
        var _this = this;
        process.nextTick(function () {
            callback(undefined, _this.color);
        });
    };
    return Color;
}());
