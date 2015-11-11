/**
 * Usage: 分类管理
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .command('listcate')
    .description('列出所有现有分类')
    .action(function() {
        var site = process.site();
        var cates = require(site + '/cates.json');
        console.log(JSON.format(cates));
    });

program
    .command('addcate')
    .description('添加分类')
    .action(function() {
        var site = process.site();
        var cates = require(site + '/cates.json');
        var index = [], names = [];
        for (var i in cates) {
            index.push( cates[i].id );
            names.push( cates[i].alias );
        }

        var questions = [
            {
                type: 'input',
                name: 'alias',
                message: '分类别名',
                validate: function(value) {
                    if ( !/^[\dA-Z_]+$/i.test(value) || names.indexOf(value) > -1 ) {
                        return '分类英文名称只能包含字母、数字或者下划线';
                    } else {
                        return true;
                    }
                }
            },
            {
                type: 'input',
                name: 'name',
                message: '分类名称'
            },
            {
                type: 'input',
                name: 'description',
                message: '分类描述'
            }
        ];

        prompts(questions, function(answers) {
            var id = Number( index.last() ) + 1;
            cates[id] = {
                id: id,
                name: answers.name || answers.alias,
                alias: answers.alias,
                description: answers.description || ''
            };

            fs.writeFileSync(site + '/cates.json', JSON.format(cates))
        });
    });