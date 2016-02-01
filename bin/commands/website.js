/**
 * Usage: 创建网站
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fm = require('../libs/fs-more');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var prompts = require('inquirer').prompt;

program
    .command('init <name>')
    .description('初始化一个网站')
    .action(function(name) {
        var allow = true;
        var source = path.resolve(__dirname, '../../site.zip');
        var target = path.resolve(process.cwd(), name);
        var question = [
            {
                type: 'confirm',
                name: 'allow',
                message: '已经存在网站' + name + '，是否要覆盖？',
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

                var siteList = [];
                var listFile = path.resolve(__dirname, '../../siteList.json');
                if (fs.existsSync(listFile)) {
                    siteList = require(listFile);
                }
                siteList.push({
                    name: name,
                    location: target
                });
                fs.writeFileSync(listFile, JSON.format(siteList));
            }
        });
    });

program
    .command('compress')
    .description('压缩网站模板')
    .action(function() {
        var JSZip = require('jszip');
        var zip = new JSZip();
        var site = process.site();
        var list = fm.readFolderSync(site);
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
        fs.writeFileSync(path.resolve(__dirname, '../../site.zip'), content);
    });

program
    .command('listsite')
    .description('列出当前计算机上所有的网站及位置')
    .action(function() {
        var siteList = [];
        var listFile = path.resolve(__dirname, '../../siteList.json');
        if (fs.existsSync(listFile)) {
            siteList = fs.readFileSync(listFile, 'utf8');
        }
        console.log(siteList);
    });

program
    .command('unlink [name]')
    .description('删除一个网站，包括记录和文件')
    .action(function(name) {
        var siteList = [], siteName = [], userList = [];
        var listFile = path.resolve(__dirname, '../../siteList.json');
        if ( fs.existsSync(listFile) ) {
            siteList = require(listFile);
            siteList.forEach(function(site, index) {
                siteName.push(site.name);
                userList.push({
                    name: site.location,
                    value: index
                });
            });

            var questions = [];
            var message = '', rmdir = '', index = -1;
            if ( name ) {
                index = siteName.search(name, 0, true);
                if ( index > -1 ) {
                    rmdir = siteList[index].location;
                } else {
                    message = '没找到要删除的网站记录，请选择要删除的网站';
                }
            } else {
                message = '找到以下网站，请选择要删除的网站';
            }
            if ( message ) {
                questions.push(
                    {
                        type: 'list',
                        name: 'site',
                        message: message,
                        choices: userList,
                        filter: Number
                    }
                );
            }
            questions.push(
                {
                    type: 'confirm',
                    name: 'allow',
                    message: '删除之后将不可恢复，是否仍然要删除 ？'
                }
            );
            prompts(questions, function(answers) {
                if ( message ) {
                    index = answers.site;
                    rmdir = siteList[index].location;
                }

                if ( answers.allow ) {
                    fm.removeFolderSync(rmdir);

                    siteList.removeAt(index);
                    if ( siteList.length > 0 ) {
                        fs.writeFileSync(listFile, JSON.format(siteList));
                    } else {
                        fs.unlinkSync(listFile);
                    }
                }
            });
        } else {
            console.log('找不到网站记录，请直接手动删除目标文件夹。');
        }
    });