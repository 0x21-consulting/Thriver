// SASPs
var providers = new Mongo.Collection('providers'),
    counties  = new Mongo.Collection('counties');

// Structure
//   _id                 {string}    auto_incr
//   Name                {string}
//   Counties served     {string[]}
//   Address             {string}
//   Coordinates for map {float[]}
//   Phone number        {string}
//   Crisis number       {string}
//   Email address       {string}
//   Website URL         {string}
//   Facebook URL        {string}
//   Twitter URL         {string}

// Publish providers
Meteor.publish('providers', function () {
    return providers.find({}); 
});
/* Publish counties
// NOTE: We only want to display counties which have providers,
//       which is why we aren't using the counties collection here
Meteor.publish('counties', function () {
    // NOTE: Meteor's mongo driver still doesn't support
    //   db.collection.distinct(), so we have to hack it
    return _.chain(
        providers.find({}, { counties: 1 }).map(function (provider) {
            return provider.counties;
    })).
    
    // provider.counties is an array, so we have to flatten them all,
    // then sort them alphabetically, then return distinct ones
    flatten().sort().uniq().value();
});*/
// Publish County ZIP codes
Meteor.publish('counties', function () {
    return counties.find({});
});
