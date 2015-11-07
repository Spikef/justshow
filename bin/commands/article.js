/**
 * Usage: 文章管理
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var path = require('path');
var program = require('commander');
var prompts = require('inquirer').prompt;

var location = path.resolve('./site/markdown/articles/');

program
    .command('add <filename>')      // 文件名，同时作为访问地址
    .description('添加文章')
    .action(function(filename) {
        filename = path.resolve(filename);
        if ( !fs.existsSync(filename) || !fs.statSync(filename).isFile() ) {
            throw new Error('目标文件不存在。');
        }
        var alias = path.basename(filename, path.extname(filename));
        var fullname = path.resolve(location, alias);
        if ( fs.existsSync(fullname + '.json') ) {
            throw new Error('该日志已存在，如要修改请使用show modify <' + alias + '>。');
        }
        // TODO: 已经位于目标目录下的处理方式
        var md = fs.readFileSync(filename, 'utf8');
        var title = md.split('\n')[0];
        if ( title && title.length>0 ) title = title.replace(/(^#\s*|\s*#$)/g, '');

        var lists = require('../../site/list.json');
        lists.unshift(alias);

        fs.writeFileSync(fullname + '.md', md);
        fs.writeFileSync('./site/list.json', lists);

        var configs = { title: title, alias: alias };
        create(configs);
    });

program
    .command('create <filename>')
    .description('创建文章')
    .action(function(filename) {
        if ( !/^[A-Z0-9\-_]+$/i.test(filename) ) {
            throw new Error('文件名只能使用数字、字母或者下划线!')
        }
        var alias = path.basename(filename, path.extname(filename));
        var fullname = path.resolve(location, alias);
        if ( fs.existsSync(fullname + '.json') ) {
            throw new Error('该日志已存在，如要修改请使用show modify <' + alias + '>。');
        }

        var lists = require('../../site/list.json');
        lists.unshift(alias);

        fs.writeFileSync(fullname + '.md', '');
        fs.writeFileSync('./site/list.json', JSON.format(lists));

        var configs = { alias: alias };
        create(configs);
    });

function create(configs, modify) {
    var cates = require('../../site/cates.json');
    var lists = [];
    for (var i in cates) {
        lists.push({
            name: cates[i].name,
            value: cates[i].id
        })
    }

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
            message: '文章标题',
            when: !configs.title,
            validate: required
        },
        {
            type: 'confirm',
            name: 'star',
            message: '推荐本文',
            default: false
        },
        {
            type: 'list',
            name: 'category',
            message: '文章分类',
            filter: Number,
            choices: lists
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
        },
        {
            type: 'input',
            name: 'tags',
            message: '文章标签'
        },
        {
            type: 'input',
            name: 'summary',
            message: '文章摘要',
            validate: required
        }
    ];

    for (var i=0;i<questions.length;i++) {
        if ( configs[questions[i].name] ) {
            questions[i].default = configs[questions[i].name];
        }
    }

    if (!modify) configs.postTime = new Date().getTime();

    prompts(questions, function(answers) {
        for (var i in answers) {
            configs[i] = answers[i]
        }

        fs.writeFileSync(path.resolve(location, configs.alias) + '.json', JSON.format(configs));
    });
}