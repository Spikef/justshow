/**
 * Usage: 创建网站
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fm = require('../libs/fsmore');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .command('init <SiteName>')
    .description('初始化一个网站')
    .action(function(SiteName) {
        var allow = true;
        var source = path.resolve(__dirname, '../../site.zip');
        var target = path.resolve(process.cwd(), SiteName);
        var question = [
            {
                type: 'confirm',
                name: 'allow',
                message: '已经存在网站' + SiteName + '，是否要覆盖？',
                when: fs.existsSync(target)
            }
        ];
        prompts(question, function(answers) {
            allow = answers.allow === undefined ? allow : answers.allow;

            if ( allow ) {
                var JSZip = require('jszip');
                var zip = new JSZip(fs.readFileSync(source));
                var folders = zip.folder(/.+?/);
                folders.forEach(function(folder) {
                    fm.makeFolderSync(path.resolve(target, folder.name));
                });
                var files = zip.file(/.+?/);
                files.forEach(function(file) {
                    fs.writeFileSync(path.resolve(target, file.name), file.asNodeBuffer());
                });
                var full = path.resolve(target, './config.json');
                var configs = require(full);
                configs.app.version = require('../../package.json').version;
                fs.writeFileSync(full, JSON.format(configs));
                // TODO: save to siteList.json
            }
        });
    });

program
    .command('compress')
    .description('压缩网站模板')
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
    .command('unlink')
    .description('删除一个网站，包括记录和文件')
    .option('-n, --name', 'name of the website')
    .action(function(options) {
        var siteList = [];
        var listFile = path.resolve('../../siteList.json');
        if (fs.existsSync(listFile)) {
            // TODO
            siteList = require(listFile)
        }
    });