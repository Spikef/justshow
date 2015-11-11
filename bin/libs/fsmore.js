/**
 * Usage: 针对fs的一些操作
 * Author: Spikef < Spikef@Foxmail.com >
 * Copyright: Envirs Team < http://envirs.com >
 */

var fs = require('fs');
var path = require('path');

exports.copyFileSync = function(source, target) {
    var readable = fs.createReadStream(source);
    var writeable = fs.createWriteStream(target);
    readable.pipe(writeable);
};

exports.copyFolderSync = function(source, target) {
    source = path.resolve(process.cwd(), source);
    target = path.resolve(process.cwd(), target);

    var self = this, file;
    var dirList = this.readFolderSync(source);
    dirList.folders.forEach(function(folder) {
        folder = target + folder.replace(source, '');
        self.makeFolderSync(folder);
    });
    dirList.files.forEach(function(base) {
        file = target + base.replace(source, '');
        self.copyFileSync(base, file);
    });
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