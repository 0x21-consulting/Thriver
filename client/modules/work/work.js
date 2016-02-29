Template.utility.onRendered(function () {
    //Need to find a way to open associated content tab based on active navigation selection
    //There are remains of a method in the legacy files
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
        if(!$('body').hasClass('workActive')){
            $('body').addClass('workActive');
        }
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