var Sections = new Mongo.Collection('sections');

// Subscribe to sections Mongo collection
Meteor.subscribe("sections");

// Render sections on page
Template.body.helpers({
    sections: function () {
        return Sections.find({});
    }
});

// Pass to header template for menu
Template.header.helpers({
    sections: function () {
        return Sections.find({ showInMenu: true });
    }
}); 