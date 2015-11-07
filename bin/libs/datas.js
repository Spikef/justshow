/**
 * Usage: 数据管理类，返回相应数据
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');

exports.app = function() {
    return require('../../package.json');
};

exports.blog = function() {
    var data = require('../../site/config.json');
    return data.blog;
};

exports.cate = function() {
    return require('../../site/cates.json');
};

/**
 * 获取一页数据
 * @param pageIndex: 索引，从第一页开始
 * @param pageSize: 每页记录条数
 * @returns {{total: number, index: number, minId: number, maxId: number, size: number, list: Array}}
 */
exports.page = function(pageIndex, pageSize) {
    var lists = require('../../site/list.json');
    var count = Math.max(Number(pageSize), lists.length);
    var total = Math.ceil(lists.length / count);
    var index = Math.min(Number(pageIndex), total);
    var minId = (index - 1) * count;
    var maxId = Math.min(index * count - 1, lists.length);
    var data = [];

    lists.slice(minId, maxId).forEach(function(item) {
        var cates = require('../../site/cates.json');
        var configs = require('../../site/markdown/articles/' + item + '.json');
        configs.cate = cates[configs.category];
        data.push(configs);
    });

    return {
        total: total,
        index: index,
        minId: minId,
        maxId: maxId,
        size: count,
        list: data
    };
};

exports.article = function(name) {
    name = '../../site/markdown/articles/' + name;
    return {
        text: fs.readdirSync(name + '.md'),
        extra: require(name + '.json')
    }
};

exports.single = function(name) {
    name = '../../site/markdown/pages/' + name;
    return {
        text: fs.readdirSync(name + '.md'),
        extra: require(name + '.json')
    }
};