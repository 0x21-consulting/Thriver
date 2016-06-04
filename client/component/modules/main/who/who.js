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
Template.personStaff.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});
Template.personBoard.helpers({
    avatar: function () {
        return Site.findOne({}, { avatar: 1 });
    }
});


//Can this be merged into a simpler function in coorelation with: account details & newsroom tabs
Template.who.events({
    // Switch tabs
    'click ul.infoTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        
        // Set the active tab
        $('ul.infoTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.infoTabsContent > li').removeClass('active');
        $('ul.infoTabsContent > li:nth-child(' + index + ')').addClass('active');
    }
});