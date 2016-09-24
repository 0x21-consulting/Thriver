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
        check(event, Object);

        // Perform update
        Thriver.events.collection.remove({ _id: event._id }, function (error, id) {
            if (error) throw new Meteor.Error(error);
        });
    }
});
