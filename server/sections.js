var sections = new Mongo.Collection('sections');

// Upsert (temporary!!)


// Publish sections -- they're public
Meteor.publish('sections', function () {
    return sections.find({});;
});