/*====================================================
 TABLE OF CONTENT
 1. function declearetion
 2. Initialization
 ====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
var themeApp = {
    featuredMedia: function(){
        $('.post').each(function() {
            var thiseliment = $(this);
            var media_wrapper = $(this).find('featured');
            var media_content_image = media_wrapper.find($('img'));
            var media_content_embeded = media_wrapper.find('iframe');
            if (media_content_image.length > 0) {
                $(media_content_image).insertAfter(thiseliment.find('.post-head')).wrap("<div class='featured-media'></div>");
                thiseliment.addClass('post-type-image');
                media_wrapper.remove();
            }
            else if (media_content_embeded.length > 0) {
                $(media_content_embeded).insertAfter(thiseliment.find('.post-head')).wrap("<div class='featured-media'></div>");
                thiseliment.addClass('post-type-embeded');
            }
        });
    },
    responsiveIframe: function() {
        $('.post').fitVids();
    },
    sidebarConfig:function() {
        if(sidebar_left == true) {
            $('.main-content').addClass('col-md-push-4');
            $('.sidebar').addClass('col-md-pull-8');
        }
    },
    highlighter: function() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    },
    highlightLine: function() {
        $('code.hljs').each(function(i, block) {
            hljs.lineNumbersBlock(block);
        });
    },
    imageDisplay: function() {
        $('.post-content img').each(function(){
            var src = $(this).attr('src');

            $(this).wrap('<a href="' + src + '" class="mfp-zoom" style="display:block;"></a>');
        });
    },
    backToTop: function() {
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        $('#back-to-top').on('click', function(e){
            e.preventDefault();
            $('html, body').animate({scrollTop : 0},1000);
            return false;
        });
    },
    fixNavigator: function() {
        var widget_width = $('.widget').width();
        var content_top = $('.main-content').offset().top;
        $("#widget-navigator").width(widget_width);
        $("#widget-navigator").affix({
            offset: {
                top: content_top,
                bottom: function () {
                    return (
                        this.bottom = $('body').height() - ($('article').offset().top + $('article').height() + 28)
                    )
                }
            }
        });

        $(window).scroll(function () {
            var scrollTop = $(window).scrollTop();
            var main_head = $('.main-content').offset().top;

            if (scrollTop >= main_head) {
                $("#widget-navigator").width(widget_width);
            } else {
                $('#widget-navigator').width('auto');
            }
        });
    },
    init: function() {
        themeApp.featuredMedia();
        themeApp.responsiveIframe();
        themeApp.sidebarConfig();
        themeApp.highlighter();
        themeApp.highlightLine();
        themeApp.imageDisplay();
        themeApp.fixNavigator();
        themeApp.backToTop();
    }
};

/*===========================
 2. Initialization
 ==========================*/
$(document).ready(function(){
    themeApp.init();
});