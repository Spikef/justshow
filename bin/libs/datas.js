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
    var site = process.site();
    var configs = require(site + '/config.json');
    return configs.blog;
};

exports.cate = function() {
    var site = process.site();
    return require(site + '/cates.json');
};

/**
 * 获取一页数据
 * @param pageIndex: 索引，从第一页开始
 * @param pageSize: 每页记录条数
 * @param category: 分类名称(可选)
 * @returns {{total: number, index: number, minId: number, maxId: number, size: number, list: Array}}
 */
exports.page = function(pageIndex, pageSize, category) {
    var site = process.site();
    var lists = require(site + '/list.json');
    var mList = category === undefined ? lists : readListByCate(lists, category);
    var count = Math.min(Number(pageSize), mList.length);
    var total = Math.ceil(mList.length / count) || 1;
    var index = Math.min(Number(pageIndex), total);
    var minId = (index - 1) * count;
    var maxId = Math.min(index * count, mList.length);
    var data = [];
    var prev = index > 1 ? index-1 : false;
    var next = index < total ? index+1 : false;

    if ( prev !== false ) {
        if ( category === undefined ) {
            prev = '../list/' + prev + '.html';
        } else {
            prev = '../../category/' + category + '/' + prev + '.html';
        }
    }

    if ( next !== false ) {
        if ( category === undefined ) {
            next = '../list/' + next + '.html';
        } else {
            next = '../../category/' + category + '/' + next + '.html';
        }
    }

    mList.slice(minId, maxId).forEach(function(item) {
        var cates = require(site + '/cates.json');
        var configs = require(site + '/markdown/articles/' + item + '.json');
        configs.cate = cates[configs.category];
        data.push(configs);
    });

    return {
        total: total,
        index: index,
        minId: minId,
        maxId: maxId,
        size: count,
        list: data,
        prev: prev,
        next: next
    };
};

exports.article = function(name) {
    var site = process.site();
    var parent = site + '/markdown/articles/';
    var article = readMarkdown(name, parent);

    if ( article ) {
        var lists = require(site + '/list.json');
        var index = lists.indexOf(name);

        article.prev = lists[index+1] ? require(parent + lists[index+1] + '.json') : false;
        article.next = lists[index-1] ? require(parent + lists[index-1] + '.json') : false;
    }

    return article;
};

exports.single = function(name) {
    var site = process.site();
    var parent = site + '/markdown/singles/';
    return readMarkdown(name, parent);
};

function readMarkdown(name, parent) {
    var site = process.site();
    var marked = require('marked');
    var render = new marked.Renderer();
    var cheerio = require('cheerio');
    var configs = require(site + '/config.json').markdown;
    name = path.resolve(parent + name);
    render.heading = markedHead;
    configs.renderer = render;
    if ( !fs.existsSync(name + '.md') || !fs.existsSync(name + '.json') ) return false;
    var text = fs.readFileSync(name + '.md', 'utf8');
    var html = marked(text, configs) || '';
    var menu = [];
    var $ = cheerio.load(html);
    $('h2, h3').each(function(i, element) {
        if ( element.tagName.toLowerCase() === 'h2' ) {
            menu.push({
                id: $(this).attr('id'),
                text: $(this).text(),
                alias: $(this).text().replace(/\([^)]*\)/g, ''),
                subs: [],
                level: 2
            })
        } else {
            menu.last().subs.push({
                id: $(this).attr('id'),
                text: $(this).text(),
                alias: $(this).text().replace(/\([^)]*\)/g, ''),
                level: 3
            });
        }
    });

    var menuHtml = '', subsHtml = '';
    menu.forEach(function(m) {
        menuHtml += '\t<li><a href="#' + m.id + '">' + m.text + '</a>{subs}\t</li>\n';
        subsHtml = '';
        m.subs.forEach(function(sm) {
            subsHtml += '\t\t\t<li><a href="#' + sm.id + '">' + sm.text + '</a></li>\n';
        });
        if ( subsHtml.length > 0 ) subsHtml = '\n\t\t<ul class="{level-h3}">\n' + subsHtml + '\t\t</ul>\n';
        menuHtml = menuHtml.replace(/\{subs}/, subsHtml);
    });
    if ( menuHtml.length > 0 ) menuHtml = '<ul class="{level-h2}">\n' + menuHtml + '</ul>';

    var result = require(name + '.json');
    result.content = html;
    result.sidebar = menuHtml.replace(/\t/g, '    ');
    result.menu = menu;

    var title = new RegExp('<h1[^>]*>' + result.title + '</h1>\\r?\\n');
    result.content = result.content.replace(title, '');

    return result;
}

function markedHead(text, level, raw) {
    var han = require('han');
    var id = han.letter(raw, '-');

    id = id.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^\w]+/g, '-');
    id = this.options.headerPrefix + id;
    id = id.replace(/(^\-|\-$)/gm, '');

    // 防止ID重复
    this.headIds = this.headIds || [];
    this.idIndex = this.idIndex || {};
    if ( this.headIds.indexOf(id) > -1 ) {
        var tid = id;
        do {
            this.idIndex[tid] = this.idIndex[tid] ? this.idIndex[tid] + 1 : 1;
            id = tid + '-' + this.idIndex[tid];
        } while ( this.headIds.indexOf(id) > -1 );
    }
    this.headIds.push(id);

    return '<h'
        + level
        + ' id="'
        + id
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
}

function readListByCate(lists, cate) {
    if ( this.category && this.category[cate] ) return this.category[cate];

    var site = process.site();
    var parent = site + '/markdown/articles/';
    var cateList = require(site + '/cates.json');
    var category = {};
    var cateName = '';
    var fullPath = '';

    for (var i in cateList) {
        category[ cateList[i].alias ] = [];
    }

    lists.forEach(function(alias) {
        fullPath = parent + alias + '.json';
        cateName = cateList[require(fullPath).category].alias;

        if ( cateName ) {
            category[cateName].push(alias);
        } else {
            category['default'].push(alias);
        }
    });

    this.category = category;

    return this.category[cate] || [];
}