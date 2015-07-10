Sections = new Mongo.Collection('sections');
Page     = new Mongo.Collection('page');

// Publish sections -- they're public
Meteor.publish('sections', function () {
    return Sections.find({}, { sort: { order: 1 }});;
});