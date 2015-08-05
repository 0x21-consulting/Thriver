// Staff & Board members
var events = new Mongo.Collection('events');

// Structure
//   _id         {int}      auto_incr
//   name        {string}
//   description {string}
//   cost        {float} || {Cost[]}
//   start       {datetime}
//   end         {datetime}

// Structure {Cost} - Used for price tiers
//   order       {int}
//   description {string}
//   cost        {float}

// Structure {datetime}
//   {string} - 'YYYY-MM-DD HH:MM:SS.mmm' - Times in Zulu

// Publish people
Meteor.publish('events', function () {
    return events.find({});
});