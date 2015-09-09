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
                $('section.carousel main').css({left: prevLeft});
            }
        }
        if($(this).hasClass('next')){
            if(left == - $('section.carousel main article').length * carouselWidth + carouselWidth){
                // do nothing
            }
            else { 
                var nextLeft = left - carouselWidth;
                $('section.carousel main').css({left: nextLeft});
            }
        }
    });
    $('.details-ref').click(function(){
        $('section.carousel').addClass('active');
     });
    $('.close-carousel').click(function(){
        $('section.carousel').removeClass('active');
     });


    //Toggle visibility of the List View in Events
    $('h4.list-view').click(function(){
        $('body').addClass('calendar-list-hide');
     });
    $('span.show-list').click(function(){
        $('body').removeClass('calendar-list-hide');
     });

    //Toggle visibility of the Alerts
    $('.alerts').click(function(){
        if($('.alerts').hasClass('active')){
            $('.alerts').removeClass('active');
        } else{
            $('.alerts').removeClass('active');
            $(this).addClass('active');
        }
     });

    //Toggle visibility of Donate Tab
    $('.donate .toggle').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            $('body').addClass('donation-active');
        }
     });

    $('.donate .close-donate').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            //Do Nothing
        }
     });

    $('nav').click(function(){
        if ($(window).width() < 768) {
           $('body').removeClass('open-nav');
        }
     });


    //Smooth Scrolling (Unable to target)
    $('nav li a').click(function(){
        //var elemID = '#' + this.id;
        //$('html, body').animate({
            //scrollTop: $(elemID).offset().top + 92
        //}, 2000);        
    });


//Illuminate Current Nav Item (Unable to target)
$(document).ready(function(){
    var section1Height = $('#work').height();
    var section2Height = $('#community').height();
    var section3Height = $('#who-we-are').height();
    var section4Height = $('#providers').height();
    var section5Height = $('#contact').height();

    $(window).scroll(function() {
        var winTop = $(window).scrollTop();
        if(winTop >= section1Height && winTop <= section2Height){
            $('a[href="#work"]').addClass("current").not().removeClass("current");
        } 
        else if(winTop >= section2Height && winTop <= section3Height){
            $('a[href="#community"]').addClass("current").not().removeClass("current");
        } 
        else if(winTop >= section3Height && winTop <= section4Height){
            $('a[href="#who-we-are"]').addClass("current").not().removeClass("current");
        } 
        else if(winTop >= section4Height && winTop <= section5Height){
            $('a[href="#providers"]').addClass("current").not().removeClass("current");
        } 
        else if(winTop >= section5Height){
            $('a[href="#contact"]').addClass("current").not().removeClass("current");
        }
    });
});


//Fix the Work Section Sidebar
$(window).scroll(function () {
    var position = $('#work').offset();
    //var menuHeight = $('#work .tabs .elements').outerHeight() -82;
    //alert(menuHeight);
    var threshold = position.top -93;
    var positionBtm = $('#community').offset();
    var btmThreshold = positionBtm.top;
    if ($(window).scrollTop() >= threshold && $(window).scrollTop() < btmThreshold){
        $('.work .tabs').addClass('fixed');
    } else{
        $('.work .tabs').removeClass('fixed bottom');
    }
});


}); //End jQuery Helpers