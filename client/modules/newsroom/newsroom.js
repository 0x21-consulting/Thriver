Template.news.onRendered(function () {
    $('ul.news-tabs > li').click(function(){
        var index = $(this).index() + 1;
        if (!$(this).hasClass('active')){
            $('ul.news-tabs > li').removeClass('active');
            $(this).addClass('active');
        }
        $('ul.news-content > li').removeClass('active');
        if (index > 1){
            $('ul.news-content > li:nth-child(' + index + ')').addClass('active');
        } else{
            $('ul.news-content > li:first-child').addClass('active');
        }
    });
});