Template.eventsRegistered.helpers({
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
