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

String.prototype.contains = String.prototype.includes;

Date.prototype.format = function(format) {
    var fecha = require('fecha');
    return fecha.format(this, format);
};

Date.format = function(input, format) {
    var fecha = require('fecha');
    return fecha.format(input, format);
};

Date.parse = function(input, format) {
    var fecha = require('fecha');
    return fecha.parse(input, format);
};