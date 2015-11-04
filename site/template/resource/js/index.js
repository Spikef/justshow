
// Typing terminal animation
$(window).load(function(){
    var version = '0.0.2';
    var data    = [
        {
            action: 'type',
            strings: ['npm install justshow^400'],
            output: '<span class="gray">justshow@'+ version +' node_modules/justshow<br>' +
                    '├── express@4.13.3<br>' +
                    '├── ftp@0.3.10<br>' +
                    '└── marked@0.3.5</span><br>&nbsp;',
            postDelay: 1000
        },
        {
            action: 'type',
            strings: ['show add^400'],
            output: '<span class="gray">New article is created successfully.</span><br>&nbsp;',
            postDelay: 1000
        },
        {
            action: 'type',
            strings: [
                'Start build:',
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
                'Finished building!'
            ],
            postDelay: 3000
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