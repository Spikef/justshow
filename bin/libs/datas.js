/**
 * Usage: 数据管理类，返回相应数据
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var path = require('path');

exports.app = function() {
    return require('../../package.json');
};

exports.blog = function() {
    var configs = require('../../site/config.json');
    return configs.blog;
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
    var lists = require('../../site/list.json');
    var index = lists.indexOf(name);
    var marked = require('marked');
    var cheerio = require('cheerio');
    var configs = require('../../site/config.json');
    name = path.resolve('./site/markdown/articles/' + name);
    if ( !fs.existsSync(name + '.md') || !fs.existsSync(name + '.json') ) return false;
    var text = fs.readFileSync(name + '.md', 'utf8');
    var html = marked(text, configs.markdown) || '';
    var menu = {};

    var article = require(name + '.json');
    article.content = html;
    article.sidebar = menu;

    var title = new RegExp('<h1[^>]*>' + article.title + '</h1>\\r?\\n');
    article.content = article.content.replace(title, '');

    article.prev = lists[index+1] ? require('../../site/markdown/articles/' + lists[index+1] + '.json') : false;
    article.next = lists[index-1] ? require('../../site/markdown/articles/' + lists[index-1] + '.json') : false;

    return article;
};

exports.single = function(name) {
    name = '../../site/markdown/pages/' + name;
    return {
        text: fs.readdirSync(name + '.md'),
        extra: require(name + '.json')
    }
};