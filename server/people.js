// Staff & Board members
var people = new Mongo.Collection('people');

// Structure
//   _id         {int}      auto_incr
//   name        {string}
//   title       {string}
//   email       {string}
//   boardMember {boolean}
//   picture     {string}   base64 representation of jpeg

// Publish people
Meteor.publish('people', function () {
    return people.find({});
});