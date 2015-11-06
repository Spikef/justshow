/**
 * Usage: 针对fs的一些操作
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var path = require('path');

exports.copyFileSync = function(source, target) {

};

exports.copyFolderSync = function(source, target) {

};

exports.readFolderSync = function(folder) {
    folder = path.resolve(process.cwd(), folder);

    var folders = [], files = [];
    var read = function(full) {
        var dirList = fs.readdirSync(full);

        dirList.forEach(function(item){
            item = full + path.sep + item;
            if( fs.statSync(item).isFile() && !path.basename(item).startsWith('.') ){
                files.push(item);
            }
        });

        dirList.forEach(function(item){
            item = full + path.sep + item;
            if( fs.statSync(item).isDirectory() ) {
                folders.push(item);
                read(item);
            }
        });
    };

    read(folder);

    return {
        folders: folders,
        files: files
    }
};

exports.makeFolderSync = function(folder) {
    folder = path.resolve(process.cwd(), folder);
    if ( path.basename(folder).contains('.') ) folder = path.dirname(folder);
    var folders = folder.split(/\/|\\/).slice(1);
    var fullDir = folder.substring(0, folder.indexOf(folders[0]));  // 取盘符
    folders.forEach(function(name) {
        fullDir += name + path.sep;
        fullDir = path.normalize(fullDir);
        !fs.existsSync(fullDir) && fs.mkdirSync(fullDir);
    })
};