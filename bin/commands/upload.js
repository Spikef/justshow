/**
 * Usage: 上传、更新等
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var program = require('commander');

program
    .command('ccc')     // 添加分类
    .description('添加分类')
    .option('-a, --all', 'Whether to display hidden files')//设置list这个命令的参数
    .action(function(options) {
        console.log('ccc')
    });
