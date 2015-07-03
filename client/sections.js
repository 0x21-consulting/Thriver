var sections = new Mongo.Collection('sections');

// Subscribe to sections Mongo collection
Meteor.subscribe("sections");

// Render sections on page
Template.body.helpers({
    sections: function () {
        return sections.find({}, { sort: { order: 1 } });
    }
});

// Pass to header template for menu
Template.header.helpers({
    sections: function () {
        return sections.find({ showInMenu: true }, 
            { sort: { order: 1 } });
    }
});