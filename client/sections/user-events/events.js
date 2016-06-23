Template.eventsRegistered.helpers({
    heading: function () {
        return 'Registered Events';
    }, 
    none: function () {
        return 'You are not currently registered for any events.';
    }, 
    detailsButton: function () {
        return 'View Event';
    }, 
    detailsButtonAria: function () {
        return 'Navigate to the WCASA events calendar to see the details of this event.';
    }, 
    unregisterButton: function () {
        return 'Unregister for this event.';
    }, 
    unregisterButtonAria: function () {
        return 'Navigate to the WCASA events calendar to see the details of this event.';
    }, 
    moreButton: function () {
        return 'View All Events';
    },
    moreButtonAria: function () {
        return 'Navigate to the WCASA events calendar to see all events.';
    },
    items: [{
            title: '"Events of All Events',
            id: 'event1025', //Ideally used for moving the focus of the UI to actual event item in learning center.
            dateTime: '2008-02-14 20:00',
            friendlyDate: 'November 21, 2015'    
        },{
            title: '"Events of Some other Events',
            id: 'event1025', //Ideally used for moving the focus of the UI to actual event item in learning center.
            dateTime: '2008-02-14 20:00',
            friendlyDate: 'November 22, 2015' 
        }
    ],
});