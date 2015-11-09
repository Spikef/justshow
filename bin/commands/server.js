/**
 * Usage: 启动一个http服务，用于本地预览
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var program = require('commander');
var express = require('express');
var render = require('../libs/render');

program
    .command('start')     // 添加分类
    .description('启动服务，默认端口为8821')
    .option('-p, --port', '服务端口号')
    .action(function(options) {
        var app = express();

        app.use('/resource/', express.static('./site/template/resource'));
        app.use('/uploads/', express.static('./site/builds/uploads'));

        app.get(/^\/(index|index\.html)?$/i, function(req, res) {
            var html = render(render.templates.index);
            sendHtml(res, html);
        });

        app.get(/^\/lists(\/(\d+))?$/i, function(req, res) {
            var pageIndex = Number(req.params[1]) || 1;
            var html = render({
                template: render.templates.list,
                pageIndex: pageIndex
            });
            sendHtml(res, html);
        });

        app.get(/^\/article\/(\w+)/i, function(req, res) {
            var name = req.params[0];
            var html = render({
                template: render.templates.article,
                name: name
            });
            sendHtml(res, html);
        });

        app.get(/^\/views\/(\w+)/i, function(req, res) {
            var html = '';
            sendHtml(res, html);
        });

        app.get('*', function(req, res) {
            var html = render('404.html');
            res.status(404).send(html);
        });

        var port = options.port || 8821;
        app.listen(port, function () {
            console.log('Open your browser to visit http://localhost:%s', port);
        });

        function sendHtml(res, html) {
            if ( html.length === 0 ) {
                html = render('404.html');
                res.status(404).send(html);
            } else {
                res.send(html);
            }
        }
    });