/**
 * Usage: 上传、更新等
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fm = require('../libs/fsmore.js');
var path = require('path');
var program = require('commander');

program
    .command('upload')
    .description('将生成的静态HTML文件上传到FTP服务器')
    .action(function() {
        var site = process.site();
        var config = require(site + '/config.json').ftp;
        var source = site + '/builds/';
        var target = config.folder ? config.folder + '/' : '';
        var errors = [];

        var FTP = require('ftp');
        var ftp = new FTP;

        var upload = function(native, remote) {
            ftp.put(native, remote, function(err) {
                if (err) {
                    errors.push({
                        native: native,
                        remote: remote
                    });

                    console.log('上传出错：' + native);
                    console.log('错误原因：' + err.message);
                } else {
                    console.log('上传成功：' + native);
                    console.log('远程地址：' + remote);
                }
            });
        };

        ftp.on('ready', function() {
            console.log('连接成功，准备上传');

            var dirList = fm.readFolderSync(source);

            dirList.folders.forEach(function(folder) {
                var remote = target + path.relative(source, folder);

                ftp.mkdir(remote, true, function(err) {
                    if (err) {
                        console.log('创建出错：' + remote);
                        console.log('错误原因：' + err.message);
                        ftp.end();
                    }
                });
            });

            dirList.files.forEach(function(file) {
                var native = file;
                var remote = target + path.relative(source, file);

                upload(native, remote);
            });

            ftp.end();
        });

        ftp.on('end', function() {
            if ( errors.length > 0 ) {
                console.log('有' + errors.length + '个文件上传失败，请重试');
            } else {
                console.log('全部上传成功');
            }

            ftp.end();
        });

        console.log('正在连接FTP服务器');
        ftp.connect({
            host: config.address,
            port: config.port,
            user: config.username,
            password: config.password,
            connTimeout: 10000,
            pasvTimeout: 10000
        });
    });