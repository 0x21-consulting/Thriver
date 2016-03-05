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
