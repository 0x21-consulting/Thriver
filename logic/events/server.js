import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from './schema';

// Publish events
Meteor.publish('events', () => Events.collection.find({}));

// Publish Registrations
Meteor.publish('registrations', function publishRegistrations(eventId) {
  // Check authorization
  if (!this.userId || !Meteor.users.findOne({ _id: this.userId }).admin) {
    throw new Meteor.Error('not-authorized');
  }

  // Parameter checks
  check(eventId, String);

  // Get all users who are subscribed to this event
  Meteor.users.find({ 'profile.events.registeredEvents.id': eventId })
    .forEach((user) => {
      this.added('registrations', user._id, user);
    });

  return this.ready();
});

Meteor.methods({
  /**
   * @summary Insert new Event into Database
   * @method
   *   @param {Object} event - Event to add
   */
  addEvent: (event) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(event, Object);

    const newEvent = event;

    // Enforce UTC
    if (newEvent.start instanceof Date) newEvent.start = new Date(newEvent.start.toISOString());
    if (newEvent.end instanceof Date) newEvent.end = new Date(newEvent.end.toISOString());

    // Perform Insert
    const result = Events.collection.insert(newEvent);

    return result;
  },

  /**
   * @summary Update an Event
   * @method
   *   @param {Object} event - Event to modify
   */
  updateEvent: (event) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(event, Object);

    // Perform update
    const result = Events.collection.update(
      { _id: event._id },
      { $set: event },
    );

    return result;
  },

  /**
   * @summary Delete an event
   * @method
   *   @param {Object} event - Event to Delete
   */
  deleteEvent: (event) => {
    // Check authorization
    if (!Meteor.userId() || !Meteor.user().admin) throw new Meteor.Error('not-authorized');

    // Parameter checks
    check(event, String);

    // Perform update
    Events.collection.remove({ _id: event }, (error) => {
      if (error) throw new Meteor.Error(error);
    });
  },

  /**
   * @summary Register for an event
   * @method
   *   @param {String} id   - Event to register for
   *   @param {Object} details - Individual event details
   */
  registerEvent: (id, details) => {
    check(id, String);
    check(details, Match.Maybe(Object));

    const userId = Meteor.userId();

    // User must be logged in to register for an event
    if (!userId) throw new Meteor.Error('You must be logged in to register for an event.');

    const event = Events.collection.findOne({ _id: id });
    if (!event) throw new Meteor.Error('Event does not exist.');

    // If the event has a cost, verify user made a purchase
    if (event.cost.length) {
      const purchase = Meteor.users.findOne({
        _id: userId,
        'payments.metadata.event_id': id,
      });

      if (!purchase) throw new Meteor.Error(`User ${userId} did not purchase registration to event ${id}.`);
    }

    // Update user profile
    Meteor.users.update({ _id: userId }, {
      $push: {
        'profile.events.registeredEvents': { id, details },
      },
    });
  },

  /**
   * @summary Unregister for an event
   * @method
   *   @param {String} event - Event to unregister from
   */
  unregisterEvent: (event) => {
    check(event, String);

    const id = Meteor.userId();

    // User must be logged in to unregister from an event
    if (!id) throw new Meteor.Error('You must be logged in to unregister from an event.');

    // Update user profile
    Meteor.users.update({ _id: id }, {
      $pull: {
        'profile.events.registeredEvents': { id: event },
      },
    });
  },
});
