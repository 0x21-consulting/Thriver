// Events
var events = new Mongo.Collection('events');

// Structure
//   _id         {string}      auto_incr
//   name        {string}
//   description {string}
//   address     {string}
//   location    {Coordinates}
//   cost        {number} || {Cost[]}    USD
//   start       {Date}
//   end         {Date}

// Structure {Coordinates} - Used for geolocation and Google Maps
//   latitude    {number}
//   longitude   {number}

// Structure {Cost} - Used for price tiers
//   order       {number}
//   description {string}
//   cost        {number}    USD

// Publish events
Meteor.publish('events', function () {
    return events.find({});
});