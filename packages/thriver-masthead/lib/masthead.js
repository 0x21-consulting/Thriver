Template.masthead.events({
    // Switch tabs
    'click ul.mastheadTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        // Set the active tab
        $('ul.mastheadTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.mastheadContent > li').removeClass('active');
        $('ul.mastheadContent > li:nth-child(' + index + ')').addClass('active');
    },
    'click section.masthead .arrow': function (event) {
        offset = $('[id="what-we-do"]').offset().top - 125;
        $('body').animate({ scrollTop: offset }, 500);
    },
    'click section.masthead .jobsOpen': function (event) {
        offset = $('[id="get-involved"]').offset().top - 125;
        $('body').animate({ scrollTop: offset }, 1500);
    },
    'click section.masthead .eventsOpen': function (event) {
        offset = $('[id="events"]').offset().top - 125;
        $('body').animate({ scrollTop: offset }, 1500);
    }
});


Template.masthead.onRendered(function () {
    function transitionSlider(){
        $( "ul.mastheadTabs > li" ).each(function() {
            if($(this).hasClass( "active" ) && $(this).is(':not(:last-child)')){
                $(this).next().trigger( "click" ); 
                return false; 
            }
            if($(this).hasClass( "active" ) && $(this).is(':last-child')){
                $('ul.mastheadTabs > li:first-child').trigger( "click" );
                return false;
            }
        });    
    }

    var sliderTimer = setInterval(transitionSlider, 9000);
    $("ul.mastheadTabs > li").click(function() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(transitionSlider, 9000);
    });
});




