Template.outreach.events({
    // Switch tabs
    'click ul.outreachTabs > li': function (event) {
        /*var index = $(event.target).index() + 1;
        $('ul.outreachTabs > li').removeClass('active');
        $(event.target).addClass('active');
        //Transition
        $("body").addClass("outreachTransition").delay(500).queue(function(){
            $(this).removeClass("outreachTransition").dequeue();
            // Set the active content
            $('ul.outreachContent').addClass('active');
            $('ul.outreachContent > li').removeClass('active');
            $('ul.outreachContent > li:nth-child(' + index + ')').addClass('active');
        }); */    

        var index = $(event.target).index() + 1;
        $('ul.outreachTabs > li').removeClass('active');
        $(event.target).addClass('active');
        $("body").addClass("outreachTransition").delay(200).queue(function(){
            $(this).removeClass("outreachTransition").dequeue();
            $('ul.outreachContent').addClass('active');
            $('ul.outreachContent > li').removeClass('active');
            $('ul.outreachContent > li:nth-child(' + index + ')').addClass('active');
        });
    }

});