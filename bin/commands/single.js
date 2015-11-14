/**
 * Usage: 单页管理
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var path = require('path');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .command('addpage <filename>')      // 文件名，同时作为访问地址别名
    .description('添加单页')
    .action(function(filename) {
        var site = process.site();
        var location = path.resolve(site + '/markdown/singles/');

        filename = path.resolve(filename);
        if ( !fs.existsSync(filename) || !fs.statSync(filename).isFile() ) {
            throw new Error('目标文件不存在。');
        }
        var alias = path.basename(filename, path.extname(filename));
        var fullname = path.resolve(location, alias);
        if ( fs.existsSync(fullname + '.json') ) {
            throw new Error('该单页已存在，如要修改请使用show modifypage <' + alias + '>。');
        }
        // TODO: 已经位于目标目录下的处理方式
        var md = fs.readFileSync(filename, 'utf8');
        var title = md.split('\n')[0] || '';
        if ( title && title.length>0 ) title = title.replace(/(^#\s*|\s*#$)/g, '');
        fs.writeFileSync(fullname + '.md', md);

        var configs = { title: title, alias: alias };
        create(configs);
    });

program
    .command('createpage <filename>')
    .description('创建单页')
    .action(function(filename) {
        var site = process.site();
        var location = path.resolve(site + '/markdown/singles/');

        if ( !/^[A-Z0-9\-_]+$/i.test(filename) ) {
            throw new Error('文件名只能使用数字、字母或者下划线!')
        }
        var alias = path.basename(filename, path.extname(filename));
        var fullname = path.resolve(location, alias);
        if ( fs.existsSync(fullname + '.json') ) {
            throw new Error('该单页已存在，如要修改请使用show modifypage <' + alias + '>。');
        }

        fs.writeFileSync(fullname + '.md', '');

        var configs = { alias: alias };
        create(configs);
    });

function create(configs, modify) {
    var site = process.site();
    var location = path.resolve(site + '/markdown/singles/');

    var required = function(value) {
        if ( value.length === 0 ) {
            return '不能为空';
        } else {
            return true;
        }
    };

    var questions = [
        {
            type: 'input',
            name: 'title',
            message: '页面标题',
            when: !configs.title,
            validate: required
        },
        {
            type: 'input',
            name: 'keywords',
            message: '文章页面关键字'
        },
        {
            type: 'input',
            name: 'description',
            message: '文章页面描述'
        }
    ];

    for (var i=0;i<questions.length;i++) {
        if ( configs[questions[i].name] ) {
            questions[i].default = configs[questions[i].name];
        }
    }

    if (!modify) {
        configs.postTime = new Date().getTime();

    }

    prompts(questions, function(answers) {
        for (var i in answers) {
            configs[i] = answers[i]
        }

        fs.writeFileSync(path.resolve(location, configs.alias) + '.json', JSON.format(configs));
    });
}