"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bool(likelihood) {
    if (likelihood === void 0) { likelihood = 50; }
    return this.random() * 100 < likelihood;
}
exports.bool = bool;
function integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.integer = integer;
function pickone(arr) {
    return arr[integer(0, arr.length - 1)];
}
exports.pickone = pickone;
