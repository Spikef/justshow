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

        app.get(/\/(index|index\.html)?$/i, function(req, res) {
            var html = render(render.templates.index);
            res.send(html);
        });

        app.get(/\/lists(\/\d+)?$/i, function(req, res) {
            var pageIndex = req.params[0] ? Number(req.params[0].substring(1)) : 1;
            var html = render({
                template: render.templates.list,
                pageIndex: pageIndex
            });
            res.send(html);
        });

        app.get(/\/artilce\/(\w+)/i), function(req, res) {

        };

        var port = options.port || 8821;
        app.listen(port, function () {
            console.log('Open your browser to visit http://localhost:%s', port);
        });
    });