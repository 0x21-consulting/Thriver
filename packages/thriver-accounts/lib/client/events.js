Template.eventsRegistered.helpers({
  /**
   * @summary Return all registered events
   * @function
   * @returns {[Object]}
   */
  events: () => {
    const id = Meteor.userId();
    const eventsArray = [];

    if (id) {
      // If the user has any registered events in their profile
      if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.events) {
        // Get those events
        const events = Meteor.user().profile.events.registeredEvents;

        if (events instanceof Array && events.length) {
          for (let i = 0; i < events.length; i += 1) {
            // Grab event from collection
            const event = Thriver.events.collection.findOne({ _id: events[i].id });

            if (event) {
              eventsArray.push({
                id: events[i].id,
                title: event.name,
                dateTime: event.start.toISOString(),
                href: `/events/${event.start.getFullYear()}/${Thriver.calendar
                  .months[event.start.getMonth()]}/${Thriver.sections.generateId(event.name)}/`,
              });
            }
          }
        }
      }
    }

    return eventsArray || [];
  },

  heading: () => 'Registered Events',
  none: () => 'You are not currently registered for any events.',
  detailsButton: () => 'View Event',
  detailsButtonAria: () =>
    'Navigate to the WCASA events calendar to see the details of this event.',
  unregisterButton: () => 'Unregister from this event',
  unregisterButtonAria: () =>
    'Navigate to the WCASA events calendar to see the details of this event.',
  moreButton: () => 'View All Events',
  moreButtonAria: () => 'Navigate to the WCASA events calendar to see all events.',
});

Template.eventsRegistered.events({
  /**
   * @summary Unregister from an event
   * @method
   */
  'click button.unregister': function () {
    Meteor.call('unregisterEvent', this.id);
  },
});
