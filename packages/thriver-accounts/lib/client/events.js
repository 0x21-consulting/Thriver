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

            eventsArray.push({
              id: events[i].id,
              title: event.name,
              dateTime: event.start.toISOString(),
              href: `/events/${event.start.getFullYear()}/${Thriver.calendar
                .months[event.start.getMonth()]}/`,
            });
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
  unregisterButton: () => 'Unregister for this event',
  unregisterButtonAria: () =>
    'Navigate to the WCASA events calendar to see the details of this event.',
  moreButton: () => 'View All Events',
  moreButtonAria: () => 'Navigate to the WCASA events calendar to see all events.',

  items: [{
    title: '"Events of All Events',
    // Ideally used for moving the focus of the UI to actual
    // event item in learning center.
    id: 'event1025',
    dateTime: '2008-02-14 20:00',
    friendlyDate: 'November 21, 2015',
  }, {
    title: '"Events of Some other Events',
    // Ideally used for moving the focus of the UI to actual
    // event item in learning center.
    id: 'event1025',
    dateTime: '2008-02-14 20:00',
    friendlyDate: 'November 22, 2015',
  }],
});
