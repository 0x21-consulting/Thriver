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
    return Thriver.events.collection.find({});
});

Meteor.methods({
    /**
     * @summary Insert new Event into Database
     * @method
     *   @param {Object} event - Event to add
     */
    addEvent: function (event) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');

        // Parameter checks
        check(event, Object);

        // Enforce UTC
        if (event.start instanceof Date)
            event.start = new Date( event.start.toISOString() );
        if (event.end instanceof Date)
            event.end = new Date( event.end.toISOString() );

        // Perform Insert
        Thriver.events.collection.insert(event, function (error, id) {
            if (error) throw new Meteor.error(error);
        });
    }
});
