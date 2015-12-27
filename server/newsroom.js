// Newsroom sections
var Newsroom = new Mongo.Collection('newsroom');

// Structure
//   _id           {string}   auto_incr
//   title         {string}
//   type          {string}
//   content       {string}
//   url           {string}
//   publisher     {string}
//   date          {date}

// @values type
//   inTheNews
//   pressRelease
//   actionAlert

// Publish Newsroom sections -- they're public
Meteor.publish('inTheNews', function () {
    return Newsroom.find({ type: 'inTheNews' }, { sort: { date: 1 }});;
});
Meteor.publish('pressReleases', function () {
    return Newsroom.find({ type: 'pressRelease' }, { sort: { date: 1 }});
});
Meteor.publish('actionAlerts', function () {
    return Newsroom.find({ type: 'actionAlert' }, { sort: { date: 1 }}); 
});