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
        offset = $('[id="what-we-do"]').offset().top - 95;
        $('body').animate({ scrollTop: offset }, 500);
    },
    'click section.masthead .jobsOpen': function (event) {
        offset = $('[id="get-involved"]').offset().top - 95;
        $('body').animate({ scrollTop: offset }, 1500);
    },
    'click section.masthead .eventsOpen': function (event) {
        offset = $('[id="events"]').offset().top - 95;
        $('body').animate({ scrollTop: offset }, 1500);
    }
});
