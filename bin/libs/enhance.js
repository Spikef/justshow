/**
 * Usage: JS对象增强类
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

if (!Array.prototype.last) {
    Array.prototype.last = function() {
        var arr = this;
        return arr[arr.length - 1];
    };
}
if (!Array.prototype.search) {
    Array.prototype.search = function(name, from) {
        if (name === undefined) throw new TypeError('"name" is null or not defined');
        if (typeof name === 'object' && !name instanceof RegExp) {
            throw new TypeError('"name" could not be object unless RegExp');
        }

        var fromIndex = parseInt(arguments[1]) || 0;

        if ( name instanceof RegExp ) {
            for (var i=fromIndex;i<this.length;i++) {
                if (typeof this[i] !== 'object' && name.test(this[i])) {
                    return i;
                }
            }
        } else {
            return this.indexOf(name, fromIndex);
        }

        return -1;
    };
}
if (!Array.prototype.remove) {
    Array.prototype.remove = function(name, all, from) {
        if (name === undefined) throw new TypeError('"name" is null or not defined');
        if (typeof name === 'object' && !name instanceof RegExp) {
            throw new TypeError('"name" could not be object unless RegExp');
        }

        var index = -1;
        do{
            index = this.search(name, from);
            if (index > -1) {
                this.splice(index, 1);
            }
            index = this.search(name, from);
        } while(all && index > -1);

        return this;
    }
}
if (!Array.prototype.removeAt) {
    Array.prototype.removeAt = function(index) {
        index = parseInt(arguments[1]) || 0;

        var val = this[index];
        if ( val !== undefined ) {
            this.splice(index, 1);
        }
        return val;
    }
}
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) {
                return true;
            }
            k++;
        }
        return false;
    };
}
if (!Array.prototype.contains) {
    Array.prototype.contains = Array.prototype.includes;
}

if (!JSON.format) {
    JSON.format = function(json) {
        var format = require('json-format');
        return format(json, {type: 'space', size: 4});
    };
}

if (!String.prototype.contains) {
    String.prototype.contains = String.prototype.includes;
}

if (!Date.prototype.format) {
    Date.prototype.format = function(format) {
        var fecha = require('fecha');
        return fecha.format(this, format);
    };
}
if (!Date.format) {
    Date.format = function(input, format) {
        var fecha = require('fecha');
        return fecha.format(input, format);
    };
}
if (!Date.parse) {
    Date.parse = function(input, format) {
        var fecha = require('fecha');
        return fecha.parse(input, format);
    };
}

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
    if ( !configs.app || !configs.app.name || configs.app.name !== 'JustShow') {
        console.log('在当前位置找不到任何网站。'.red);
        process.exit(1);
    }

    var version = require('../../package.json').version;
    if ( !configs.app.version || version !== configs.app.version ) {
        console.log('不受支持的版本。'.yellow);
        process.exit(1);
    }

    this.name = configs.app.name;
    this.version = configs.app.version;

    process._site = process.cwd();
    return process._site;
};