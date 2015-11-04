/**
 * Usage: 启动一个http服务，用于本地预览
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var program = require('commander');
var express = require('express');

program
    .command('start')     // 添加分类
    .description('启动服务，默认端口为8821')
    .option('-p, --port', '服务端口号')
    .action(function(options) {
        var app = express();
        app.use('/', express.static('./site/template'));

        var port = options.port || 8821;
        app.listen(port, function () {
            console.log('Open your browser to visit http://localhost:%s', port);
        });
    });