Template.news.onRendered(function () {
    $('ul.newsTabs > li').click(function(){
        var index = $(this).index() + 1;
        if (!$(this).hasClass('active')){
            $('ul.newsTabs > li').removeClass('active');
            $(this).addClass('active');
        }
        $('ul.newsContent > li').removeClass('active');
        if (index > 1){
            $('ul.newsContent > li:nth-child(' + index + ')').addClass('active');
        } else{
            $('ul.newsContent > li:first-child').addClass('active');
        }
    });
});