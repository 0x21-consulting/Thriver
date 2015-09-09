// Staff & Board members
var events = new Mongo.Collection('events');

// Structure
//   _id         {int}      auto_incr
//   name        {string}
//   description {string}
//   address     {string}
//   location    {Coordinates}
//   cost        {float} || {Cost[]}    USD
//   start       {datetime}
//   end         {datetime}

// Structure {Coordinates} - Used for geolocation and Google Maps
//   latitude    {number}
//   longitude   {number}

// Structure {Cost} - Used for price tiers
//   order       {int}
//   description {string}
//   cost        {float}    USD

// Structure {datetime}
//   {string} - 'YYYY-MM-DD HH:MM:SS.mmm' - Times in Zulu

// Publish people
Meteor.publish('events', function () {
    return events.find({});
});