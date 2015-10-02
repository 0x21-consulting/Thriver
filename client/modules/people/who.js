// Subscriptions
People = new Mongo.Collection('people');
Meteor.subscribe('people');

// People
Template.who.helpers({
    staff: function () {
        return People.find({ boardMember: false }, { sort: { name: 1 }});
    },
    board: function () {
        return People.find({ boardMember: true }, { sort: { title: -1, name: 1 }});
    }
});
Template.person.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});

// Sliders
Template.registerHelper('slider', function () {
    var windowWidth = document.body.offsetWidth,
        elemWidth   = this.offsetWidth;
        
    console.debug(this);
});

// From jQuery Helpers file
// TODO: rewrite
Template.who.onRendered(function () {
    //Slide Who We Are Section
    $('.slider-nav.prev').click(function () {
        var leftPos = $('main.slider-content').scrollLeft();   
        $("main.slider-content").animate({
            scrollLeft: leftPos - 768
        }, 800);
    });

    $('.slider-nav.next').click(function () {
        var leftPos = $('main.slider-content').scrollLeft();
        $("main.slider-content").animate({
            scrollLeft: leftPos + 768
        }, 800);
    });
});