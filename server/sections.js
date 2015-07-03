var sections = new Mongo.Collection('sections');

// Publish sections -- they're public
Meteor.publish('sections', function () {
    return sections.find({}, { sort: { order: 1 }});;
});