Template.outreach.events({
    // Switch tabs
    'click ul.outreachTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        
        // Set the active tab
        $('ul.outreachTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.outreachContent').addClass('active');
        $('ul.outreachContent > li').removeClass('active');
        $('ul.outreachContent > li:nth-child(' + index + ')').addClass('active');
    }

});