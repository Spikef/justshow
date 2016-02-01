/**
 * Usage: 根据模板将markdown生成文章、更新列表等
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var fm = require('../libs/fs-more.js');
var path = require('path');
var program = require('commander');
var express = require('express');
var render = require('../libs/render');

program
    .command('build')
    .description('生成静态HTML文件')
    .action(function() {
        var html = '';
        var site = process.site();
        var target = site + '/builds';
        var index = 1;

        // index.html
        html = render({
            routers: render.routers.index
        });
        fs.writeFileSync(target + '/index.html', html);

        // list.html
        do {
            html = render({
                routers: render.routers.list,
                pageIndex: index
            });

            if ( html !== '' ) {
                if ( index === 1 ) fs.writeFileSync(target + '/list/index.html', html);
                fs.writeFileSync(target + '/list/' + index + '.html', html);
            }

            index++;
        } while( html !== '' );

        // category.html
        var cates = require(site + '/cates.json');
        for (var i in cates) {
            index = 1;

            do {
                html = render({
                    routers: render.routers.category,
                    category: cates[i].alias,
                    pageIndex: index
                });

                if ( html !== '' ) {
                    if ( index === 1 ) {
                        fm.makeFolderSync(target + '/category/' + cates[i].alias);
                        fs.writeFileSync(target + '/category/' + cates[i].alias + '/index.html', html);
                    }
                    fs.writeFileSync(target + '/category/' + cates[i].alias + '/' + index + '.html', html);
                }

                index++;
            } while( html !== '');
        }

        // article.html
        var lists = require(site + '/list.json');
        lists.forEach(function(name) {
            html = render({
                routers: render.routers.article,
                name: name
            });
            fs.writeFileSync(target + '/article/' + name + '.html', html);
        });

        // single.html
        var singles = require(site + '/single.json');
        singles.forEach(function(name) {
            html = render({
                routers: render.routers.views,
                name: name
            });
            fs.writeFileSync(target + '/views/' + name + '.html', html);
        });

        fm.copyFolderSync(site + '/template/resource', target + '/resource');
    });