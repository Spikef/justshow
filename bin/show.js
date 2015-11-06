#!/usr/bin/env node

require('./libs/enhance.js');

var fs = require('fs');
var fm = require('./libs/fsmore');
var path = require('path');
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
                var JSZip = require('jszip');
                var zip = new JSZip(fs.readFileSync('./site.zip'));
                var folders = zip.folder(/.+?/);
                folders.forEach(function(folder) {
                    fm.makeFolderSync(path.resolve('./sites', folder.name));
                });
                var files = zip.file(/.+?/);
                files.forEach(function(file) {
                    fs.writeFileSync(path.resolve('./sites', file.name), file.asNodeBuffer());
                });
            }
        });
    });

program
    .command('compress')
    .action(function() {
        var JSZip = require('jszip');
        var zip = new JSZip();
        var site = path.resolve('./site');
        var list = fm.readFolderSync('./site');
        list.folders.forEach(function(folder) {
            zip.file(
                folder.substring(site.length + 1),
                null,
                {
                    dir: true,
                    date: fs.statSync(folder).mtime
                }
            )
        });
        list.files.forEach(function(file) {
            zip.file(
                file.substring(site.length + 1),
                fs.readFileSync(file),
                {
                    date: fs.statSync(file).mtime
                }
            );
        });
        var content = zip.generate({
            type: 'nodebuffer',
            base64: false,
            compression: 'DEFLATE',
            platform: process.platform
        });
        fs.writeFileSync('./site.zip', content)
    });

program
    .command('test')
    .action(function() {

        fm.makeFolderSync('./sites/aa/b.txt');
    });

require('./commands/server.js');
require('./commands/config.js');
require('./commands/category.js');
require('./commands/article.js');
require('./commands/single.js');
require('./commands/build.js');
require('./commands/upload.js');

program.parse(process.argv);
