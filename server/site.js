// General site-wide attributes
var Site = new Mongo.Collection('site');

// Structure
//   avatar  {string}   The generic avatar for the Who template

Meteor.publish('site', function () {
    return Site.find({});
});