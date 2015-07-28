// All sections on the page, including tabbed ones
// Make it global -- it needs to be accessed by the admin.js too
Sections = new Mongo.Collection('sections');

// Structure
//   _id           {string}   auto_incr
//   name          {string}
//   icon          {char}
//   content       {string}
//   order         {int}
//   displayOnPage {boolean}
//   tabs          {string[]}

// Publish sections -- they're public
Meteor.publish('sections', function () {
    return Sections.find({}, { sort: { order: 1 }});;
});