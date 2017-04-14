(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Avatars = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var objectAssign = require("object-assign");
var async = (typeof window !== "undefined" ? window['async'] : typeof global !== "undefined" ? global['async'] : null);
var chance_1 = (typeof window !== "undefined" ? window['window'] : typeof global !== "undefined" ? global['window'] : null);
var Avatars = (function () {
    function Avatars(spriteSet, options) {
        if (options === void 0) { options = {}; }
        this.spriteSet = spriteSet;
    }
    Avatars.prototype.create = function (token, callback, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        async.each(this.spriteSet, function (sprite, next) {
            sprite.load(next);
        }, function (err) {
            if (err) {
                callback(err, null);
                return;
            }
            var avatarOptions = objectAssign({
                size: 20,
                order: Object.keys(_this.spriteSet)
            }, _this.options, options);
            var chance = new chance_1.Chance(token);
            var canvas = canvas_1.createCanvas();
            var context = canvas.getContext('2d');
            canvas.width = avatarOptions.size;
            canvas.height = avatarOptions.size;
            // Disable image smoothing
            context.imageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.oImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            async.eachSeries(avatarOptions.order, function (spriteName, next) {
                var sprite = _this.spriteSet[spriteName];
                if (sprite) {
                    sprite.create(chance, function (err, image) {
                        if (err) {
                            next(err);
                            return;
                        }
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                        next();
                    });
                }
                else {
                    next(new Error('Sprite ' + spriteName + ' does not exist.'));
                }
            }, function (err) {
                if (err) {
                    callback(err, null);
                }
                var image = new Image;
                image.addEventListener('load', function () {
                    callback(null, image);
                });
                image.addEventListener('error', function (err) {
                    callback(err.error, image);
                });
                image.src = canvas.toDataURL('image/png');
            });
        });
    };
    return Avatars;
}());
exports.default = Avatars;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./helper/canvas":3,"object-assign":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = (function () {
    function Color(colors) {
        this.colors = colors;
    }
    Color.prototype.getColor = function (chance) {
        return this.pickedColors[chance.seed] = this.pickedColors[chance.seed] || chance.pickone(this.colors);
    };
    return Color;
}());
exports.default = Color;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var avatars = require('./avatars').default;
avatars.SPRITE_SETS = {
    female: require('./spriteSets/female').default
};
module.exports = avatars;

},{"./avatars":1,"./spriteSets/female":6}],5:[function(require,module,exports){
(function (process){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./helper/canvas");
var Sprite = (function () {
    function Sprite(options) {
        this.image = null;
        this.imageError = null;
        this.imageSprites = null;
        // Set default options
        options.size = options.size || 20;
        options.chance = options.chance || 100;
        this.options = options;
    }
    Sprite.prototype.load = function (callback) {
        var _this = this;
        if (null === this.image) {
            // Create HTMLImageElement
            this.image = canvas_1.createImage();
            this.image.addEventListener('load', function () {
                _this.imageSprites = Math.floor(_this.image.width / _this.options.size);
            });
            this.image.addEventListener('error', function (err) {
                _this.imageError = err.error;
            });
        }
        if (this.image.src && this.image.complete) {
            process.nextTick(function () { return callback(_this.imageError, _this.image); });
        }
        else {
            this.image.addEventListener('load', function () {
                callback(null, _this.image);
            });
            this.image.addEventListener('error', function (err) {
                callback(err.error, _this.image);
            });
        }
        if (!this.image.src) {
            this.image.src = this.options.src;
        }
    };
    Sprite.prototype.create = function (chance, callback) {
        var _this = this;
        if (!this.image.complete) {
            process.nextTick(function () { return callback(new Error('Sprite image not loaded.'), null); });
            return;
        }
        if (this.createdImages[chance.seed]) {
            process.nextTick(function () { return callback(null, _this.createdImages[chance.seed]); });
            return;
        }
        var canvas = canvas_1.createCanvas();
        var context = canvas.getContext('2d');
        canvas.width = this.options.size;
        canvas.height = this.options.size;
        if (chance.bool({ likelihood: this.options.chance })) {
            context.drawImage(this.image, chance.natural({ min: 0, max: this.imageSprites - 1 }) * this.options.size * -1, 0);
            var color = this.options.color.getColor(chance);
            var buffer = context.getImageData(0, 0, canvas.width, canvas.height);
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
            context.putImageData(buffer, 0, 0);
        }
        var sprite = canvas_1.createImage();
        sprite.addEventListener('load', function () {
            _this.createdImages[chance.seed] = sprite;
            callback(null, sprite);
        });
        sprite.addEventListener('error', function (err) {
            callback(err.error, sprite);
        });
        sprite.src = canvas.toDataURL('image/png');
    };
    return Sprite;
}());
exports.default = Sprite;

}).call(this,require('_process'))
},{"./helper/canvas":3,"_process":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sprite_1 = require("../sprite");
var color_1 = require("../color");
var spriteSet = {
    face: new sprite_1.default({
        src: './assets/female/face.png',
        color: new color_1.default([
            [255, 219, 172],
            [241, 194, 125],
            [224, 172, 105],
            [198, 134, 66],
            [141, 85, 36]
        ])
    }),
    mouth: new sprite_1.default({
        src: './assets/female/mouth.png',
        color: new color_1.default([
            [219, 172, 152],
            [210, 153, 133],
            [201, 130, 118],
            [227, 93, 106],
            [227, 33, 83],
            [222, 15, 13]
        ])
    }),
    eyes: new sprite_1.default({
        src: './assets/female/eyes.png',
        color: new color_1.default([
            [118, 119, 139],
            [105, 123, 148],
            [100, 123, 144],
            [91, 124, 139],
            [88, 131, 135]
        ])
    }),
    eyebrows: new sprite_1.default({
        src: './assets/female/eyebrows.png',
        color: new color_1.default([
            [50, 50, 50]
        ])
    }),
    accessories: new sprite_1.default({
        src: './assets/female/accessories.png',
        chance: 15,
        color: new color_1.default([
            [218, 165, 32],
            [255, 215, 0],
            [238, 232, 170],
            [250, 250, 210],
            [211, 211, 211],
            [169, 169, 169]
        ])
    }),
    glasses: new sprite_1.default({
        src: './assets/female/glasses.png',
        chance: 25,
        color: new color_1.default([
            [95, 112, 92],
            [67, 103, 125],
            [94, 23, 45],
            [255, 182, 122],
            [160, 75, 93],
            [25, 25, 25],
            [50, 50, 50],
            [75, 75, 75]
        ])
    }),
    clothes: new sprite_1.default({
        src: './assets/female/clothes.png',
        color: new color_1.default([
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
        ])
    }),
    hair: new sprite_1.default({
        src: './assets/female/hair.png',
        chance: 95,
        color: new color_1.default([
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
        ])
    }),
};
exports.default = spriteSet;

},{"../color":2,"../sprite":5}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
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

},{}]},{},[4])(4)
});