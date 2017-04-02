(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Avatars = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachSeries = require("async-each-series");
var canvas_1 = require("./helper/canvas");
canvas_1.createCanvas();
var Avatars = (function () {
    function Avatars(options) {
        if (options === void 0) { options = Avatars.DEFAULT_OPTIONS; }
        this.options = options;
    }
    Avatars.prototype.create = function (gender, token, callback) {
        var _this = this;
        var canvas = this.createCanvas();
        var canvasContext = canvas.getContext('2d');
        if (undefined === this.options.sprites[gender]) {
            callback(new Error('Unconfigured gender'));
            return;
        }
        eachSeries(this.options.order, function (sprite, next) {
            var spriteOptions = _this.options.sprites[gender][sprite];
            if (spriteOptions && _this.rand(1, 100) <= spriteOptions.chance) {
                var canvasLayer_1 = _this.createCanvas();
                var canvasLayerContext_1 = canvasLayer_1.getContext('2d');
                var layerImage_1 = new Image();
                layerImage_1.onload = function () {
                    var sprites = layerImage_1.width / _this.options.size;
                    var randSprite = _this.rand(0, sprites - 1);
                    var color = spriteOptions.colors[_this.rand(0, spriteOptions.colors.length - 1)];
                    canvasLayerContext_1
                        .drawImage(layerImage_1, _this.options.size * randSprite * -1, 0);
                    var buffer = canvasLayerContext_1.getImageData(0, 0, canvasLayer_1.width, canvasLayer_1.height);
                    for (var i = 0; i < buffer.data.length; i += 4) {
                        var r = i;
                        var g = i + 1;
                        var b = i + 2;
                        var a = i + 3;
                        if (a > 0) {
                            buffer.data[r] = Math.round((buffer.data[r] - color[0]) * (buffer.data[r] / 255) + color[0]);
                            buffer.data[g] = Math.round((buffer.data[g] - color[1]) * (buffer.data[g] / 255) + color[1]);
                            buffer.data[b] = Math.round((buffer.data[b] - color[2]) * (buffer.data[b] / 255) + color[2]);
                        }
                    }
                    canvasLayerContext_1.putImageData(buffer, 0, 0);
                    canvasContext.drawImage(canvasLayer_1, 0, 0);
                    next();
                };
                layerImage_1.onerror = function (err) {
                    next(err);
                };
                layerImage_1.src = spriteOptions.src;
            }
            else {
                next();
            }
        }, function (err) {
            callback(err, canvas.toDataURL());
        });
    };
    Avatars.prototype.createCanvas = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        return canvas;
    };
    Avatars.prototype.rand = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    return Avatars;
}());
Avatars.DEFAULT_OPTIONS = {
    size: 20,
    order: [
        'face',
        'mouth',
        'eyes',
        'eyebrows',
        'accessories',
        'glasses',
        'clothes',
        'hair'
    ],
    sprites: {
        male: {},
        female: {
            accessories: {
                src: './assets/female/accessories.png',
                chance: 15,
                colors: [
                    [218, 165, 32],
                    [255, 215, 0],
                    [238, 232, 170],
                    [250, 250, 210],
                    [211, 211, 211],
                    [169, 169, 169]
                ]
            },
            clothes: {
                src: './assets/female/clothes.png',
                chance: 100,
                colors: [
                    [209, 17, 65],
                    [0, 177, 89],
                    [0, 174, 219],
                    [243, 119, 53],
                    [255, 196, 37],
                    [116, 0, 1],
                    [174, 0, 1],
                    [238, 186, 48],
                    [150, 206, 180],
                    [255, 238, 173],
                    [255, 111, 105],
                    [255, 204, 92],
                    [136, 216, 176]
                ]
            },
            eyebrows: {
                src: './assets/female/eyebrows.png',
                chance: 100,
                colors: [
                    [50, 50, 50]
                ]
            },
            eyes: {
                src: './assets/female/eyes.png',
                chance: 100,
                colors: [
                    [118, 119, 139],
                    [105, 123, 148],
                    [100, 123, 144],
                    [91, 124, 139],
                    [88, 131, 135]
                ]
            },
            face: {
                src: './assets/female/face.png',
                chance: 100,
                colors: [
                    [255, 219, 172],
                    [241, 194, 125],
                    [224, 172, 105],
                    [198, 134, 66],
                    [141, 85, 36]
                ]
            },
            glasses: {
                src: './assets/female/glasses.png',
                chance: 25,
                colors: [
                    [95, 112, 92],
                    [67, 103, 125],
                    [94, 23, 45],
                    [255, 182, 122],
                    [160, 75, 93],
                    [25, 25, 25],
                    [50, 50, 50],
                    [75, 75, 75]
                ]
            },
            hair: {
                src: './assets/female/hair.png',
                chance: 95,
                colors: [
                    [9, 8, 6],
                    [44, 34, 43],
                    [113, 99, 90],
                    [183, 166, 158],
                    [214, 196, 194],
                    [202, 191, 177],
                    [220, 208, 186],
                    [255, 245, 225],
                    [230, 206, 168],
                    [229, 200, 168],
                    [222, 188, 153],
                    [184, 151, 120],
                    [165, 107, 70],
                    [181, 82, 57],
                    [141, 74, 67],
                    [145, 85, 61],
                    [83, 61, 50],
                    [59, 48, 36],
                    [85, 72, 56],
                    [78, 67, 63],
                    [80, 68, 68],
                    [106, 78, 66],
                    [167, 133, 106],
                    [151, 121, 97]
                ]
            },
            mouth: {
                src: './assets/female/mouth.png',
                chance: 100,
                colors: [
                    [219, 172, 152],
                    [210, 153, 133],
                    [201, 130, 118],
                    [227, 93, 106],
                    [227, 33, 83],
                    [222, 15, 13],
                ]
            }
        }
    }
};
exports.default = Avatars;

},{"./helper/canvas":2,"async-each-series":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createCanvas() {
    return document.createElement('canvas');
}
exports.createCanvas = createCanvas;
function createImage() {
    return new Image();
}
exports.createImage = createImage;

},{}],3:[function(require,module,exports){
module.exports = require('./avatars').default;

},{"./avatars":1}],4:[function(require,module,exports){
(function (process){
module.exports = function (arr, iterator, callback) {
  callback = callback || function () {};
  if (!Array.isArray(arr) || !arr.length) {
      return callback();
  }
  var completed = 0;
  var iterate = function () {
    iterator(arr[completed], function (err) {
      if (err) {
        callback(err);
        callback = function () {};
      }
      else {
        ++completed;
        if (completed >= arr.length) { callback(); }
        else { nextTick(iterate); }
      }
    });
  };
  iterate();
};

function nextTick (cb) {
  if (typeof setImmediate === 'function') {
    setImmediate(cb);
  } else {
    process.nextTick(cb);
  }
}
}).call(this,require('_process'))
},{"_process":5}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[3])(3)
});