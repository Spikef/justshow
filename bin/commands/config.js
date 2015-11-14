/**
 * Usage: 程序配置项
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .command('config <option>')
    .description('修改配置')
    .action(function(option) {
        var site = process.site();

        var configs = require(site + '/config.json');
        if ( !configs[option] ) configs[option] = {};

        var questions = [];
        switch(option) {
            case 'ftp':
                questions = [
                    {
                        type: 'input',
                        name: 'address',
                        message: 'FTP地址'
                    },
                    {
                        type: 'input',
                        name: 'port',
                        message: '端口地址，如果不知道则跳过',
                        default: 21,
                        filter: Number
                    },
                    {
                        type: 'input',
                        name: 'username',
                        message: '登录用户'
                    },
                    {
                        type: 'password',
                        name: 'username',
                        message: '登录密码'
                    },
                    {
                        type: 'input',
                        name: 'folder',
                        message: '子目录，如果没有则跳过'
                    }
                ];
                break;
            case 'blog':
                questions = [
                    {
                        type: 'input',
                        name: 'name',
                        message: '博客名称'
                    },
                    {
                        type: 'input',
                        name: 'title',
                        message: '博客标题'
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: '博主名称'
                    },
                    {
                        type: 'input',
                        name: 'username',
                        message: '登录用户'
                    },
                    {
                        type: 'password',
                        name: 'password',
                        message: '管理密码，'
                    },
                    {
                        type: 'input',
                        name: 'keywords',
                        message: '博客整站关键字'
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: '博客整站描述'
                    },
                    {
                        type: 'input',
                        name: 'copyright',
                        message: '博客版权信息'
                    },
                    {
                        type: 'input',
                        name: 'pageSize',
                        message: '每页显示日志条数',
                        filter: Number
                    }
                ];
                break;
        }
        if ( questions.length > 0 ) {
            for (var i=0;i<questions.length;i++) {
                questions[i].default = configs[option][questions[i].name];
            }

            prompts(questions, function(answers) {
                for (var i in answers) {
                    configs[option][i] = answers[i]
                }

                fs.writeFileSync(site + '/config.json', JSON.format(configs));
            });
        } else {
            console.log('未知命令');
        }
    });