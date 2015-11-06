/**
 * Usage: JS对象增强类
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

Array.prototype.last = function() {
    var arr = this;
    return arr[arr.length - 1];
};

JSON.format = function(json) {
    var format = require('json-format');
    return format(json, {type: 'space', size: 4});
};

// npm install mkdirp --save