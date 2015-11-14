/**
 * Usage: 启动一个http服务，用于本地预览
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var program = require('commander');
var express = require('express');
var render = require('../libs/render');

program
    .command('start')
    .description('启动服务，默认端口为8821')
    .option('-p, --port', '服务端口号')
    .action(function(options) {
        var site = process.site();

        var app = express();

        app.use('/static/', express.static(site + '/builds'));

        app.use('/resource/', express.static(site + '/template/resource'));
        app.use('/uploads/', express.static(site + '/builds/uploads'));

        app.get(/^\/(index|index\.html)?$/i, function(req, res) {
            var html = render(render.routers.index);
            sendHtml(res, html);
        });

        app.get(/^\/lists(\/(\d+))?(\.html)?$/i, function(req, res) {
            var pageIndex = Number(req.params[1]) || 1;
            var html = render({
                routers: render.routers.list,
                pageIndex: pageIndex
            });
            sendHtml(res, html);
        });

        app.get(/^\/category\/(\w+)(\/(\d+))?(\.html)?$/i, function(req, res) {
            var category = req.params[0];
            var pageIndex = Number(req.params[2]) || 1;
            var html = render({
                routers: render.routers.category,
                category: category,
                pageIndex: pageIndex
            });
            sendHtml(res, html);
        });

        app.get(/^\/article\/(\w+)(\.html)?$/i, function(req, res) {
            var name = req.params[0];
            var html = render({
                routers: render.routers.article,
                name: name
            });
            sendHtml(res, html);
        });

        app.get(/^\/views\/(\w+)(\.html)?$/i, function(req, res) {
            var name = req.params[0];
            var html = render({
                routers: render.routers.views,
                name: name
            });
            sendHtml(res, html);
        });

        app.get('*', function(req, res) {
            var html = render('404');
            res.status(404).send(html);
        });

        var port = options.port || 8821;
        app.listen(port, function () {
            console.log('Open your browser to visit http://localhost:%s', port);
        });

        function sendHtml(res, html) {
            if ( html.length === 0 ) {
                html = render('404');
                res.status(404).send(html);
            } else {
                res.send(html);
            }
        }
    });