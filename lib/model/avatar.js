"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("../helper/canvas");
/**
 * Generated Avatar
 *
 * Contains export methods for formats supported by `node-canvas`.
 */
var Avatar = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param canvas
     */
    function Avatar(canvas) {
        this.canvas = canvas;
    }
    /**
     * Exports the avatar as PNG data url
     *
     * @param options
     */
    Avatar.prototype.getPNG = function (options) {
        if (options === void 0) { options = {}; }
        return this.getDataUrl('image/png', options);
    };
    /**
     * Exports the avatar as JPEG data url
     *
     * @param options
     */
    Avatar.prototype.getJPEG = function (options) {
        if (options === void 0) { options = {}; }
        return this.getDataUrl('image/jpeg', options);
    };
    /**
     * Exports the avatar as GIF data url
     *
     * @param options
     */
    Avatar.prototype.getGIF = function (options) {
        if (options === void 0) { options = {}; }
        return this.getDataUrl('image/gif', options);
    };
    /**
     * Exports the avatar as SVG data url
     *
     * @param options
     */
    Avatar.prototype.getSVG = function (options) {
        if (options === void 0) { options = {}; }
        return this.getDataUrl('image/svg+xml', options);
    };
    /**
     * Exports the avatar in various formats as data url
     *
     * @param format
     * @param options
     */
    Avatar.prototype.getDataUrl = function (format, options) {
        var canvas = this.canvas;
        if (options.background) {
            canvas = this.tintBackground(canvas, options.background);
        }
        if (options.size) {
            canvas = this.resize(canvas, options.size);
        }
        return this.canvas.toDataURL(format);
    };
    /**
     * Resizes the avatar and returns the new canvas
     *
     * @param canvas
     * @param size
     */
    Avatar.prototype.resize = function (canvas, size) {
        var newCanvas = canvas_1.createCanvas();
        newCanvas.width = size;
        newCanvas.height = size;
        var context = newCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        return newCanvas;
    };
    /**
     * Sets a background color and returns the new canvas
     *
     * @param canvas
     * @param color
     */
    Avatar.prototype.tintBackground = function (canvas, color) {
        var newCanvas = canvas_1.createCanvas();
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        var context = newCanvas.getContext('2d');
        context.beginPath();
        context.rect(0, 0, newCanvas.width, newCanvas.height);
        context.fillStyle = color;
        context.fill();
        context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        return newCanvas;
    };
    return Avatar;
}());
exports.default = Avatar;
