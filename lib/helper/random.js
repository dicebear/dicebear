"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom/seedrandom");
var Random = /** @class */ (function () {
    function Random(seed) {
        this.seed = seed;
        this.prng = seedrandom(seed);
    }
    Random.prototype.bool = function (likelihood) {
        if (likelihood === void 0) { likelihood = 50; }
        return this.prng() * 100 < likelihood;
    };
    Random.prototype.integer = function (min, max) {
        return Math.floor(this.prng() * (max - min + 1) + min);
    };
    Random.prototype.pickone = function (arr) {
        return arr[this.integer(0, arr.length - 1)];
    };
    return Random;
}());
exports.default = Random;
