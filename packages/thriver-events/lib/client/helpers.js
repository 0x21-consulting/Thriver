// Upcoming Events helpers
Template.upcomingEvents.helpers({
    /**
     * @summary List five upcoming events
     * @function
     * @returns {Mongo.Collection}
     */
    upcomingEvents: function () {
        return Thriver.events.collection.find({ start: { $gt: new Date() }},
            { sort: { start: 1 }, limit: 5 });
    }
});

// Upcoming Event item Helpers
Template.upcomingEventListItem.helpers({
    /**
     * @summary Show friendly date
     * @function
     * @returns {String}
     */
    friendlyDate: function () {
        return Thriver.calendar.months[ this.start.getMonth() ].substr(0,3) + ' ' +
            this.start.getDate();
    }
});

// Event Details helpers
Template.eventSlide.helpers({
    /**
     * @summary Show Start Date
     * @function
     * @returns {String}
     */
    startDate: function () {
        var date = this.start;

        return Thriver.calendar.months[ date.getMonth() ] + ' ' +
            date.getDate() + ', ' + date.getFullYear();
    },

    /**
     * @summary Show Start Time
     * @function
     * @returns {String}
     */
    startTime: function () {
        var time = this.start,
            hour = time.getHours(),
            minutes = time.getMinutes(),
            am = false,
            date = '';

        // If the event spans multiple days, include the date
        if (this.end instanceof Date)
            if ( this.start.getDate() !== this.end.getDate() ) {
                date = Thriver.calendar.months[ this.start.getMonth() ] +
                    ' ' + this.start.getDate();
                return date;
            }

        // Determine morning or evening
        if (hour === (hour % 12) )
            am = true;

        // Convert to 12 hour clock
        if (hour % 12 === 0)
            hour = 12;
        else
            hour = hour % 12;

        // Format with leading zero if necessary
        if (hour.toString().length < 2)
            hour = '0' + hour;

        // Same for minutes
        if (minutes.toString().length < 2)
            minutes = '0' + minutes;

        return hour + ':' + minutes + (am? ' AM' : ' PM');
    },

    /**
     * @summary Show End Date and time
     * @function
     * @returns {String}
     */
    endTime: function () {
        // Do nothing if no date is set
        if ( !(this.end instanceof Date) )
            return '';

        var time = this.end,
            hour = time.getHours(),
            minutes = time.getMinutes(),
            am = false,
            date = '';

        // If the event spans multiple days, include the date
        if ( this.start.getDate() !== this.end.getDate() ) {
            date = Thriver.calendar.months[ this.end.getMonth() ] + ' ' + this.end.getDate();
            return ' — ' + date;
        }

        // Determine morning or evening
        if (hour === (hour % 12) )
            am = true;

        // Convert to 12 hour clock
        if (hour % 12 === 0)
            hour = 12;
        else
            hour = hour % 12;

        // Format with leading zero if necessary
        if (hour.toString().length < 2)
            hour = '0' + hour;

        // Same for minutes
        if (minutes.toString().length < 2)
            minutes = '0' + minutes;

        return ' - ' + hour + ':' + minutes + (am? ' AM' : ' PM');
    },

    /**
     * @summary Create a link for address
     * @function
     * @returns {String}
     */
    address: function () {
        // If this is a web link
        if (this.location.webinarUrl)
            return '<a href="' + this.location.webinarUrl + '" target="_blank">Online</a>';

        // If there is a location
        /*if (this.location instanceof Object)
            if (this.location.latitude && this.location.longitude)
                return '<a href="https://www.google.com/maps/place/' + this.address +
                    '/@' + this.location.latitude + ',' + this.location.longitude +
                    ',14z" target="_blank">' + this.address + '</a>';*/

        if (this.location.mapUrl)
            return '<a href="' + this.location.mapUrl + '" target="_blank">' +
                this.location.name + '</a>';

        // Otherwise, just return the name
        return this.location.name;
    },

    /**
     * @summary Display number of other events occurring on same day
     * @function
     * @returns {Number}
     */
    numberSameDayEvents: function () {
        // We use a list here instead of just a db count because an event that
        // starts today can also end today, creating a duplicate.

        // The list
        events = {};

        // For function scoping
        var that = this,

        // For each event, add ID to list
        addEvent = function (event) {
            // Don't include this event
            if (that._id === event._id)
                return;

            // Else, add
            events[ event._id ] = event;
        },

        // toDateString() removes time data, going to midnight today
        yesterday = new Date( this.start.toDateString() );
        tomorrow  = new Date( new Date(yesterday).setDate( yesterday.getDate() + 1 ));

        // Today is clearly between yesterday and tomorrow
        today = { $gte: yesterday, $lte: tomorrow },

        // Total count
        total = 0;

        // Get all events that start today
        Thriver.events.collection.find({ start: today }).forEach(addEvent);

        // Get all events that end today
        Thriver.events.collection.find({ end  : today }).forEach(addEvent);

        // Get all events that both start before today and end after today
        Thriver.events.collection.find({
            start: {
                // Before today at midnight
                $lt: new Date( this.start.toDateString() )
            },
            end: {
                // After today at 11:59:59 PM
                $gt: new Date( this.start.toDateString() + ' 23:59:59' )
            }
        }).forEach(addEvent);

        // Enumerate list to get count
        for (let event in events)
            ++total;

        // Now store as array for other helpers
        Thriver.events.sameDayEvents = [];

        for (let event in events)
            Thriver.events.sameDayEvents.push( events[event] );

        return total;
    },

    /**
     * @summary Return same day events
     * @function
     * @returns {Object[]}
     */
    sameDayEvents: function () {
        return Thriver.events.sameDayEvents;
    },

    /**
     * @summary Return whether sameDayEvents is singular or plural
     * @function
     * @returns {Boolean}
     */
    isSingular: function () {
        if (Thriver.events.sameDayEvents.length > 1)
            return false;
        return true;
    }
});

// Events helpers
Template.events.helpers({
    //Temp Future/Past Content
    items: [{
        //Need to find away to get background images in here
        tabs: [{ //If sidebar has tabs: use this property
                title: 'Upcoming Events',
                id: 'upcomingEventsList', //These are for aria-controls
                template: 'upcomingEventsList'
            },{
                title: 'Past Events',
                id: 'pastEventsList',
                template: 'pastEventsList'
            }
        ]
    }],

    /**
     * Provide current event data to event slides
     * @function
     * @returns {string[]}
     */
    events: function () {
        var nextMonth, noPastEvents, noFutureEvents,

        // Get all events that start or end in this month
        events = Thriver.events.collection.find({
            $or: [{
                start: {
                    $gte: new Date( Thriver.calendar.thisYear.get(),
                        Thriver.calendar.thisMonth.get() ),
                    $lt : new Date( Thriver.calendar.thisYear.get(),
                        Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate() )
            }}, {
                end: {
                    $gte: new Date( Thriver.calendar.thisYear.get(),
                        Thriver.calendar.thisMonth.get() ),
                    $lt : new Date( Thriver.calendar.thisYear.get(),
                        Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate() )
                }
            }]
        }, { sort: { start: 1 } });

        // Update total for slides
        if (events.count()) {
            Thriver.events.slideTotal.set( events.count() );
            Thriver.events.slide(0);
            return events;
        }

        // No slide this month

        // Are there any future events?
        events = Thriver.events.collection.find({
            start: {
                $gt: new Date(
                    Thriver.calendar.thisYear.get(),
                    Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate() )
            }
        });
        if (!events.count()) noFutureEvents = true;

        // Are there any past events?
        events = Thriver.events.collection.find({
            end: {
                $lt: new Date( Thriver.calendar.thisYear.get(),
                    Thriver.calendar.thisMonth.get() )
            }
        });
        if (!events.count()) noPastEvents = true;

        // Now we only have one slide
        Thriver.events.slideTotal.set(1);

        // Return that slide
        Thriver.events.slide(0);
        return [{
            month         : Thriver.calendar.months[ Thriver.calendar.thisMonth.get() ],
            year          : Thriver.calendar.thisYear.get(),
            noEvents      : true,
            noFutureEvents: noFutureEvents,
            noPastEvents  : noPastEvents
        }];
    }
});
