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
    category: 'list.html',
    article: 'article.html',
    single: 'single.html',
    404: '404.html'
};
var routers = {
    index: 'index',
    list: 'list',
    category: 'category',
    article: 'article',
    views: 'single',
    404: '404'
};

var render = function(params, options) {
    var site = process.site();

    if (typeof params === 'string') params = {routers: params};
    params.template = params.template || templates[params.routers];
    if ( !params.template ) return '';
    var template = fs.readFileSync(site + '/template/' + params.template, 'utf8');

    var engine = require('./datas.js');
    var data = {
        app: engine.app(),
        cate: engine.cate(),
        blog: engine.blog()
    };

    switch (params.routers) {
        case routers.list:
            data.page = engine.page(params.pageIndex, data.blog.pageSize);
            break;
        case routers.category:
            data.page = engine.page(params.pageIndex, data.blog.pageSize, params.category);
            break;
        case routers.article:
            template = template.replace(/(<%)=(\s*article(\.|\[('|"))(content|sidebar)(\4])?.*%>)/g, '$1-$2');
            data.article = engine.article(params.name);
            if ( !data.article ) return '';
            break;
        case routers.views:
            template = template.replace(/(<%)=(\s*single(\.|\[('|"))(content|sidebar)(\4])?.*%>)/g, '$1-$2');
            data.single = engine.single(params.name);
            if ( !data.single ) return '';
            break;
    }

    return ejs.render(template, data, options);
};

render.compile = ejs.compile;

render.routers = routers;

render.templates = templates;

module.exports = render;