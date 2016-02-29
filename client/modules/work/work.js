Template.utility.onRendered(function () {
    //Should be attributed to correct alert (Figured alerts would be managed via a meteor variable)
    $('.workNav > ul > li > a, .workNav > ul > li > .icon > a').click(function(){
        event.preventDefault();
        $('.workNav >ul > li').removeClass('active');
        $(this).closest('li').addClass('active');
        if(!$('body').hasClass('workActive')){
            $('body').addClass('workActive');
        }
    });

    $('.workNav ul > li > ul > li > a').click(function(){
        event.preventDefault();
        $('.workNav ul > li > ul > li').removeClass('active');
        $(this).parent().addClass('active');
        $(this).parent().parent().parent().addClass('active');
    });

    $('.workNav li.backToIndexWork a').click(function(){
        event.preventDefault();
        if($('body').hasClass('workActive')){
            $('body').removeClass('workActive');
        }
    });
});