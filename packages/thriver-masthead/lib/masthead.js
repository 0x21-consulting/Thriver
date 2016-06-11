// Populate Profile tab under Account Overview
Template.masthead.helpers({
    items: [{
        //Need to find away to get background images in here
        tabs: [{ //If sidebar has tabs: use this property
                title: 'April is Sexual Assault Awareness Month',
                id: 'mastheadSlideA', //These are for aria-controls
                template : 'slideA' //This could really just be an editable content area instead of unique templates
            },{
                title: 'Join the WCASA team in making a big difference',
                id: 'mastheadSlideB',
                template : 'slideB'
            },{
                title: 'Training Institute Conference',
                id: 'mastheadSlideC',
                template: 'slideC'
            }
        ]
    }]
})

Template.masthead.events({
    'click section.masthead .arrow': function (event) {
        offset = $('[id="what-we-do"]').offset().top - 125;
        $('body').animate({ scrollTop: offset }, 500);
    },
    //These are temporary for demo purposes: need to find a way to quickly link with rich content
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
    //Auto Rotate function
    function transitionSlider(){
        $( "#masthead menu.tabs > li" ).each(function() {
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
    $("#masthead menu.tabs > li").click(function() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(transitionSlider, 9000);
    });
});