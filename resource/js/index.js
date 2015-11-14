
// Typing terminal animation
$(window).load(function(){
    var version = '0.0.2';
    var data    = [
        {
            action: 'type',
            strings: ['npm install justshow -g^400'],
            output: '<span class="gray">justshow@'+ version +' node_modules/justshow<br>' +
                    '├── express@4.13.3<br>' +
                    '├── ejs@2.3.4<br>' +
                    '├── commander@2.9.0<br>' +
                    '├── inquirer@0.11.0<br>' +
                    '├── colors@1.1.2<br>' +
                    '├── json-format@0.1.1<br>' +
                    '├── ftp@0.3.10<br>' +
                    '├── jszip@2.5.0<br>' +
                    '├── cheerio@0.19.0<br>' +
                    '└── marked@0.3.5</span><br>&nbsp;',
            postDelay: 1000
        },
        {
            action: 'type',
            strings: ['show init helloworld^400'],
            output: "&nbsp;",
            postDelay: 1000
        },
        {
            action: 'type',
            strings: ['cd helloworld^400'],
            output: "&nbsp;",
            postDelay: 1000
        },
        {
            action: 'type',
            strings: ['show start^400'],
            output: '<span class="gray">Open your browser to visit http://localhost:8821</span><br>&nbsp;',
            postDelay: 1000
        }
    ];
    runScripts(data, 0);
});
function runScripts(data, pos) {
    var prompt = $('.prompt'), script = data[pos];
    if (script.clear === true) {
        $('.history').html('');
    }
    switch (script.action) {
        case 'type':
            prompt.removeData();
            $('.typed-cursor').text('');
            prompt.typed({
                strings: script.strings,
                typeSpeed: 30,
                callback: function () {
                    var history = $('.history').html();
                    history = history ? [history] : [];
                    history.push('$ ' + prompt.text());
                    if (script.output) {
                        history.push(script.output);
                        prompt.html('');
                        $('.history').html(history.join('<br>'));
                    }
                    $('section.terminal').scrollTop($('section.terminal').height());
                    pos++;
                    if (pos < data.length) {
                        setTimeout(function () {
                            runScripts(data, pos);
                        }, script.postDelay || 1000);
                    }
                }
            });
            break;
        case 'view':
            break;
    }
}