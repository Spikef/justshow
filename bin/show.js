#!/usr/bin/env node

require('./libs/enhance.js');

var program = require('commander');

program
    .version(require('../package.json').version, '-v, --version')
    .parse(process.argv);

program
    .command('test')
    .action(function() {
        console.log(Date.format(new Date(), 'dddd MMMM Do, YYYY'))
    });

require('./commands/project.js');
require('./commands/server.js');
require('./commands/config.js');
require('./commands/category.js');
require('./commands/article.js');
require('./commands/single.js');
require('./commands/build.js');
require('./commands/upload.js');

program.parse(process.argv);
