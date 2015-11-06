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
        var cates = require('../../site/cates.json');
        console.log(JSON.format(cates));
    });

program
    .command('addcate')
    .description('添加分类')
    .action(function() {
        var cates = require('../../site/cates.json');
        var names = Object.keys(cates);

        var questions = [
            {
                type: 'input',
                name: 'alias',
                message: '分类地址名称',
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
            var id = cates[ names.last() ].id + 1;
            cates[answers.alias] = {
                id: id,
                name: answers.name || answers.alias,
                alias: answers.alias,
                description: answers.description || ''
            };

            fs.writeFileSync('./site/cates.json', JSON.format(cates))
        });
    });

/*
id
title
name
author
category
summary
keywords
description
tags
postTime
 */