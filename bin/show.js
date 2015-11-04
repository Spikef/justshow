#!/usr/bin/env node

require('./libs/enhance.js');

var program = require('commander');

program
    .version(require('../package.json').version, '-v, --version')
    .parse(process.argv);

program
    .command('test')
    .action(function() {

    });

require('./commands/server.js');
require('./commands/category.js');
require('./commands/upload.js');

program.parse(process.argv);
