/**
 * @summary Return a friendly date range for the upcoming events badge
 * @function
 *   @param {Date} start
 *   @param {Date} end
 * @returns {String}
 */
Template.registerHelper('friendly', (start, end) => {
    check(start, Date);
    check(end, Date);

    let string = '',

    /**
     * @summary Return 'st', 'nd', 'rd', or 'th' for dates
     * @function
     *   @param {Number} date
     * @returns {String}
     */
    nth = (date) => {
                if (date === 1 || date === 21 || date === 31)  return 'st';
        else if (date === 2 || date === 22)                 return 'nd';
        else if (date === 3 || date === 23)                 return 'rd';
        
        return 'th';
    };

    // Start string with abbriviated month and date
    string += Thriver.calendar.months[ start.getMonth() ].substr(0, 3) + ' ' +
        start.getDate();

    // 1st, 2nd, 3rd, or nth
    string += nth( start.getDate() );
    
    // If the event ends on a different day than it starts, create a range
    if ( start.toDateString() !== end.toDateString() ) {
        // Add the hyphen
        string += '-';

        // If year or month differ, then show the month
        if ( start.getFullYear() !== end.getFullYear() ||
                start.getMonth   () !== end.getMonth   () )
                string += Thriver.calendar.months[ end.getMonth() ].substr(0, 3) + ' ';
        
        // Now display the date
        string += end.getDate() + nth( end.getDate() );
    }

    return string;
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {$.Event} event
 */
let navigate = (event) => {
    check(event, $.Event);

    // Do nothing else
    event.preventDefault();

    // Navigate
    Thriver.events.navigate(event.currentTarget.dataset.id);

    // Close `View All`
    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
};

/** View All Templates events */
Template.pastEventsList    .events({ 'click a': navigate });
Template.upcomingEventsList.events({ 'click a': navigate });

/** Past Events under `View All` helpers */
Template.pastEventsList.helpers({
    /**
     * @summary Return all past events
     * @function
     * @returns {Meteor.Collection}
     */
    pastEvents: function () {
        let month  = new Date().getMonth(),
            year   = new Date().getFullYear(),
            date   = new Date().getDate(),

            // This month's events
            events = Thriver.events.collection.find({ start: { 
                $lt : new Date(year, month, date),
                $gte: new Date(year, month) } },
            { sort: { start: -1 } }),

            // Count of all previous events
            count = Thriver.events.collection.find({ start: {
                $lt: new Date(year, month, date) }}).count(),

            futureEvents = [];

        // Until there are no events left
        while ( count ) {
            // Add this months' events
            // If there are no events this month, don't add anything
            if ( events.count() )
                futureEvents.push({
                    month : Thriver.calendar.months[ month ],
                    year  : year,
                    event: events.fetch()
                });

            // Advance month & year
            year  = month - 1 < 0 ? year - 1 : year;
            month = month - 1 < 0 ? 11 : month - 1;

            // Get new events
            events = Thriver.events.collection.find({ start: {
                $lt : new Date(year, month + 1),
                $gte: new Date(year, month) } },
            { sort: { start: -1 } });

            // For while loop, in case there are months with no events
            // but still some events in the future at some point
            count = Thriver.events.collection.find({ start: {
                $lt: new Date(year, month + 1) }}).count();
        }

        return futureEvents;
    }
});

/** Upcoming Events under `View All` helpers */
Template.upcomingEventsList.helpers({
    /**
     * @summary Return all upcoming events
     * @function
     * @returns {Meteor.Collection}
     */
    upcomingEvents: function () {
        let month  = new Date().getMonth(),
            year   = new Date().getFullYear(),
            date   = new Date().getDate(),

            // This month's events
            events = Thriver.events.collection.find({ start: { 
                $gte: new Date(year, month, date),
                $lt : new Date(year, month + 1) } }),

            // Count of all future events
            count = Thriver.events.collection.find({ start: {
                $gte: new Date(year, month) }}).count(),

            futureEvents = [];

        // Until there are no events left
        while ( count ) {
            // Add this months' events
            // If there are no events this month, don't add anything
            if ( events.count() )
                futureEvents.push({
                    month : Thriver.calendar.months[ month ],
                    year  : year,
                    event: events.fetch()
                });

            // Advance month & year
            year  = month + 1 > 11 ? year + 1 : year;
            month = (month + 1) % 12;

            // Get new events
            events = Thriver.events.collection.find({ start: {
                $gte: new Date(year, month),
                $lt : new Date(year, month + 1) } });

            // For while loop, in case there are months with no events
            // but still some events in the future at some point
            count = Thriver.events.collection.find({ start: {
                $gte: new Date(year, month) }}).count();
        }

        return futureEvents;
    }
});
