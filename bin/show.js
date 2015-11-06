#!/usr/bin/env node

require('./libs/enhance.js');

var fs = require('fs');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .version(require('../package.json').version, '-v, --version')
    .parse(process.argv);

program
    .command('site')
    .action(function() {
        var allow = true;
        var question = [
            {
                type: 'confirm',
                name: 'allow',
                message: '已经存在site目录，是否要覆盖？',
                when: fs.existsSync('./site')
            }
        ];
        prompts(question, function(answers) {
            allow = answers.allow === undefined ? allow : answers.allow;

            if ( allow ) {
                var AdmZip = require('adm-zip');
                var zip = new AdmZip('./site.zip');
                zip.extractAllTo('./sites', true);
            }
        });
    });

program
    .command('compress')
    .action(function() {
        console.log('zip')
    });

program
    .command('test')
    .action(function() {
        console.log('test');
    });

require('./commands/server.js');
require('./commands/config.js');
require('./commands/category.js');
require('./commands/article.js');
require('./commands/single.js');
require('./commands/build.js');
require('./commands/upload.js');

program.parse(process.argv);
