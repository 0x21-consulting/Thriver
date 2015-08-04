/* -All jQuery & JS usage for UI enhancements has been moved from templates
    to this document for review, improvements and to be moved as seen fit. */


Template.body.onRendered(function () {
    //Bind the 'esc' button to close any active 'modal' states
    //Scroll event which toggles between header states
    //Animate elements as they load in


    // Header State Change (window.scroll)
    window.addEventListener('scroll', function (event) {
        if (!document.body.classList.contains('scrolled'))
            if (window.scrollY > 160) 
                document.body.classList.add('scrolled');
        
        if (document.body.classList.contains('scrolled'))
            if (window.scrollY < 160) {
                document.body.classList.remove('scrolled');
                document.querySelector('header nav').classList.remove('active');
            }
    },false);

    // Menu Toggle Click
    document.querySelector('.menu-toggle').addEventListener('mouseup', function () {
        if (document.body.classList.contains('open-nav'))
            document.body.classList.remove('open-nav');
        else
            document.body.classList.add('open-nav');
    });


    // Carousel Function
    $('.carousel nav li').click(function(){
        var left = parseInt($('.carousel main').css('left'));
        var carouselWidth = $('.carousel main').width();
        if($(this).hasClass('prev')){
            if(left == 0 ){
                // do nothing
            }
            else { 
                var prevLeft = left + carouselWidth;
                $('.carousel main').css({left: prevLeft});
            }
        }
        if($(this).hasClass('next')){
            if(left == - $('.carousel main article').length * carouselWidth + carouselWidth){
                // do nothing
            }
            else { 
                var nextLeft = left - carouselWidth;
                $('.carousel main').css({left: nextLeft});
            }
        }
    });
    $('.details-ref').click(function(){
        $('.carousel').addClass('active');
     });
    $('.close-carousel').click(function(){
        $('.carousel').removeClass('active');
     });


}); //End jQuery Helpers