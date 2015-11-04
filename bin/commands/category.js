/**
 * Usage: 分类管理
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');

var program = require('commander');
var prompts = require('cli-prompt');

program
    .command('listcate')
    .description('列出所有现有分类')
    .action(function() {
        var cates = require('../../site/cates.json');
        console.log(JSON.format(cates));
    });

program
    .command('addcate')
    .description('添加分类')
    .action(function() {
        var cates = require('../../site/cates.json');
        var names = Object.keys(cates);
        prompts.multi([
            {
                label: '分类地址名称',
                key: 'alias',
                default: '',
                validate: function(value) {
                    if ( !/^[\dA-Z_]+$/i.test(value) || names.indexOf(value) > -1 ) {
                        throw new Error ('分类英文名称只能包含字母、数字或者下划线');
                    }
                }
            },
            {
                label: '分类名称',
                key: 'name',
                default: ''
            },
            {
                label: '分类描述',
                key: 'description',
                default: ''
            }
        ], function(options) {
            var id = cates[ names.last() ].id + 1;
            cates[options.alias] = {
                id: id,
                name: options.name || options.alias,
                alias: options.alias,
                description: options.description || ''
            };

            console.log(require('path').resolve('./site/cates.json'));

            fs.writeFileSync('./site/cates.json', JSON.format(cates))
        });
    });