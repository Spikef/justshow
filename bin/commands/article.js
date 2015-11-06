/**
 * Usage: 文章管理
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var program = require('commander');
var prompts = require('inquirer').prompt;

//program
//    .command('add <filename>')      // 文件名，同时作为访问地址
//    .description('添加文章')
//    .action(function(filename) {
//        var md = fs.readFileSync(filename, 'utf8');
//        var title = md.split('\n')[0];
//        if ( title && title.length>0 ) title = title.replace(/(^#\s*|\s*#$)/g, '');
//
//        fs.writeFileSync('./site/markdown/articles/' + filename + '.md', md);
//        fs.writeFileSync('./site/markdown/articles/' + filename + '.json', '{title: ' + title + '}');
//
//        create(filename);
//    });

program
    .command('create <filename>')
    .description('创建文章')
    .action(function(filename) {
        if ( !/^[A-Z0-9\-_]+$/i.test(filename) ) {
            throw new Error('文件名只能使用数字、字母或者下划线!')
        }

        if ( fs.existsSync('./site/markdown/articles/' + filename) ) {
            throw new Error('文件名已存在，如果需要修改请使用modify命令!')
        }

        fs.writeFileSync('./site/markdown/articles/' + filename + '.md', '');
        fs.writeFileSync('./site/markdown/articles/' + filename + '.json', '{}');

        create(filename);
    });

function create(filename) {
    var extra = require('../../site/markdown/articles/' + filename + '.json');
    var cates = require('../../site/cates.json');
    var names = Object.keys(cates);
    prompts.multi([
        {
            label: '文章标题',
            key: 'title',
            default: extra.title,
            validate: function(value) {
                if ( value.length === 0 ) {
                    throw new Error ('文章标题不能为空');
                }
            }
        },
        {
            label: '文章分类',
            key: 'cate',
            default: ''
        }
    ], function(options) {
        fs.writeFileSync('./site/markdown/articles/' + filename + '.json', JSON.format(options));
    });
}