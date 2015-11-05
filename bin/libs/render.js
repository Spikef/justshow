/**
 * Usage: 渲染模板
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var ejs = require('ejs');

var templates = {
    index: 'index.html',
    list: 'list.html',
    article: 'article.html',
    single: 'single.html'
};

var render = function(params, options) {
    if (typeof params === 'string') params = {template: params};
    params.template = templates[params.template] || params.template;
    var template = fs.readFileSync('./site/template/' + params.template, 'utf8');

    var engine = require('./datas.js');
    var data = {
        app: engine.app(),
        cate: engine.cate(),
        blog: engine.blog()
    };

    switch (params.template) {
        case templates.list:
            data.page = engine.page(params.pageIndex, data.blog.pageSize);
            break;
        case templates.article:
            data.article = engine.article(params.name);
            break;
        case templates.single:
            data.single = engine.single(params.name);
            break;
    }

    return ejs.render(template, data, options);
};

render.compile = ejs.compile;

render.templates = templates;

module.exports = render;