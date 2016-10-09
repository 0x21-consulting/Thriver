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
            if (error) throw new Meteor.Error(error);
        });
    },

    /**
     * @summary Update an Event
     * @method
     *   @param {Object} event - Event to modify
     */
    updateEvent: function (event) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Parameter checks
        check(event, Object);
        console.log(event);
        // Perform update
        Thriver.events.collection.update({ _id: event._id }, { $set: event },
            function (error, id) {
                if (error) throw new Meteor.Error(error);
        });
    },

    /**
     * @summary Delete an event
     * @method
     *   @param {Object} event - Event to Delete
     */
    deleteEvent: function (event) {
        // Check authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Parameter checks
        check(event, String);

        // Perform update
        Thriver.events.collection.remove({ _id: event }, function (error, id) {
            if (error) throw new Meteor.Error(error);
        });
    },

    /**
     * @summary Register for an event
     * @method
     *   @param {String} event   - Event to register for
     *   @param {Object} details - Individual event details
     */
    registerEvent: (event, details) => {
        let id = Meteor.userId();

        check(event, String);
        check(details, Match.Maybe(Object) );
        check(id, String);  // make audit-argument-checks happy

        // User must be logged in to register for an event
        if ( !id )
            throw new Meteor.Error('You must be logged in to register for an event.');
        
        // Update user profile
        Meteor.users.update({ _id: id }, { $push: {
            'profile.events.registeredEvents': {
                id: event,
                details: details
            }
        }});
    }
});
