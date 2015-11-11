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

process.site = function() {
    if ( process._site ) return process._site;

    var fs = require('fs');
    var path = require('path');
    var colors = require('colors');
    var cfg = path.resolve(process.cwd(), 'config.json');

    if ( !fs.existsSync(cfg)) {
        console.log('在当前位置找不到任何网站。'.red);
        process.exit(1);
    }

    var configs = require(cfg);
    if ( !configs.app || !configs.app.name || configs.app.name !== 'JustShow' || !configs.app.version) {
        console.log('在当前位置找不到任何网站。'.red);
        process.exit(1);
    }

    var version = require('../../package.json').version;
    if ( version != configs.app.version ) {
        console.log('不受支持的版本。'.yellow);
        process.exit(1);
    }

    this.name = configs.app.name;
    this.version = configs.app.version;

    process._site = process.cwd();
    return process._site;
};