/**
 * Usage: 根据模板将markdown生成文章、更新列表等
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var fm = require('../libs/fsmore.js');
var program = require('commander');
var express = require('express');
var render = require('../libs/render');

program
    .command('build')
    .description('生成静态HTML文件')
    .action(function() {
        var html = '';
        var site = process.site();
        var target = site + '/builds';

        // index.html
        html = render(render.routers.index);
        fs.writeFileSync(target + '/index.html', html);

        // list.html
        var lists = require(site + '/list.json');


        // article.html
        lists.forEach(function(name) {
            html = render({
                routers: render.routers.article,
                name: name
            });
            fs.writeFileSync(target + '/article/' + name + '.html', html);
        });

        // single.html

        //app.get(/^\/lists(\/(\d+))?(\.html)?$/i, function(req, res) {
        //    var pageIndex = Number(req.params[1]) || 1;
        //    var html = render({
        //        routers: render.routers.list,
        //        pageIndex: pageIndex
        //    });
        //    sendHtml(res, html);
        //});
        //
        //app.get(/^\/category\/(\w+)(\/(\d+))?(\.html)?$/i, function(req, res) {
        //    var category = req.params[0];
        //    var pageIndex = Number(req.params[2]) || 1;
        //    var html = render({
        //        routers: render.routers.category,
        //        category: category,
        //        pageIndex: pageIndex
        //    });
        //    sendHtml(res, html);
        //});
        //
        //
        //
        //app.get(/^\/views\/(\w+)(\.html)?$/i, function(req, res) {
        //    var name = req.params[0];
        //    var html = render({
        //        routers: render.routers.views,
        //        name: name
        //    });
        //    sendHtml(res, html);
        //});



        html = render('404');
        fs.writeFileSync(target + '/404.html', html);

        fm.copyFolderSync(site + '/template/resource', target + '/resource');
    });