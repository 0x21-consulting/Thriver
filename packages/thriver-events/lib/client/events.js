SimpleSchema.debug = true;

// Subscribe to events
Meteor.subscribe('events');

var nextPosition = 1,
    prevPosition = -1,
    slideTotal = new ReactiveVar(0);

/** An List of all of today's events */
Thriver.events.sameDayEvents = [];

/**
 * Get all events that start or end in the active month
 * @function
 * @returns {Object}
 */
Thriver.events.getThisMonthEvents = function () {
    var currentEvents = {},
        total = Thriver.calendar.lastDate();

    // Get all events and organize them in an easily-accessible way
    Thriver.events.collection.find({
        $or: [{
            start: { 
                $gte: new Date( Thriver.calendar.thisYear.get(), 
                    Thriver.calendar.thisMonth.get() ),
                $lt : new Date( Thriver.calendar.thisYear.get(), 
                    Thriver.calendar.thisMonth.get(), total )
        }}, {
            end: { 
                $gte: new Date( Thriver.calendar.thisYear.get(), 
                    Thriver.calendar.thisMonth.get() ),
                $lt : new Date( Thriver.calendar.thisYear.get(), 
                    Thriver.calendar.thisMonth.get(), total )
            }
        }]
    }, { sort: { start: 1 } }).forEach(function (event) {
        // If there's no start date, do nothing
        if (! (event.start instanceof Date)) return;

        var start = event.start.getDate(),
            total = 1, i;

        // If there's an end date, calculate total number of days
        if (event.end instanceof Date) {
            total = event.end.getDate() - start + 1;

            // If total is negative, event spans multiple months
            if ( total < 0) {
                // If the event ends this month
                if ( event.end.getMonth() === Thriver.calendar.thisMonth.get() ) {
                    // Calculate total number of days for just this month
                    total = event.end.getDate();
                    start = 1;
                } else
                    // Otherwise, it starts this month
                    total = Thriver.calendar.lastDate() - event.start.getDate() + 1;
            }
        }

        // For each day, add event info
        for (i = 0; i < total; ++i) {
            // If the date doesn't already exist, add it
            if (! currentEvents[ start + i ])
                currentEvents[ start + i ] = [];
            // Add event details
            currentEvents[ start + i ].push(event);
        }
    });

    return currentEvents;
};

// Events helpers
Template.events.helpers({
    /**
     * Provide current event data to event slides
     * @function
     * @returns {string[]}
     */
    events: function () {
        var events = Thriver.events.collection.find({
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
        slideTotal.set( events.count() );

        return events;
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
        if ( this.start.getDate() !== this.end.getDate() ) {
            date = Thriver.calendar.months[ this.start.getMonth() ] + ' ' + this.start.getDate();
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
        if ( this.address.match(/^https?:/i) )
            return '<a href="' + this.address + '" target="_blank">Online</a>';
        
        // If there is a location
        if (this.location instanceof Object)
            if (this.location.latitude && this.location.longitude)
                return '<a href="https://www.google.com/maps/place/' + this.address +
                    '/@' + this.location.latitude + ',' + this.location.longitude + 
                    ',14z" target="_blank">' + this.address + '</a>';
        
        // Otherwise, just return the address
        return this.address;
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

Template.events.events({
    /**
     * Switch to previous month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-prev-month, click .prevMonth': function (event) {
        if ( !(event instanceof $.Event) ) return;

        var lastMonth = Thriver.calendar.thisMonth.get() - 1;

        if (lastMonth < 0)
            Thriver.calendar.thisYear.set( Thriver.calendar.thisYear.get() - 1 );

        Thriver.calendar.thisMonth.set( Thriver.calendar.getLastMonth() );
    },
    /**
     * Switch to next month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-next-month, click .nextMonth': function (event) {
        if ( !(event instanceof $.Event) ) return;

        var nextMonth = Thriver.calendar.thisMonth.get() + 1;

        if (nextMonth > 11)
            Thriver.calendar.thisYear.set( Thriver.calendar.thisYear.get() + 1);

        Thriver.calendar.thisMonth.set(nextMonth % 12);
    },

    /**
     * @summary Show Even Add Form
     * @method
     *   @param {$.Event} event
     */
    'click li.addEvent': function (event) {
        check(event, $.Event);

        var slider = event.delegateTarget.querySelector('.eventsSlider'),
            admin  = event.delegateTarget.querySelector('section.addEvent');

        if (slider instanceof Element)
            slider.classList.add('hide');
        if (admin instanceof Element)
            admin.classList.remove('hide');
        
    },

    // Eoghan's stuff
    'click .sliderPrev': function (event) {
        check(event, $.Event);

        if (prevPosition >= 0){
            document.querySelector('.slides').style.webkitTransform = 
                'translate(-' + prevPosition + '00% ,0px)';
            --prevPosition;
            --nextPosition;
        }
    },
    'click .sliderNext': function (event) {
        check(event, $.Event);

        if (nextPosition < slideTotal.get()){
            document.querySelector('.slides').style.webkitTransform = 
                'translate(-' + nextPosition + '00% ,0px)';
            ++prevPosition;
            ++nextPosition;
        }
    },
    'click button.eventDate': function (event) {
        check(event, $.Event);

        var id = event.target.datset.id;

        document.querySelector('.slides').style.webkitTransform = 
            'translate(-' + id + '00% ,0px)';

        nextPosition = Number(id) + 1;
        prevPosition = Number(id) - 1;
        calMobileEvent();
    },
    'click a.eventDate': function (event) {
        check(event, $.Event);
        event.preventDefault();

        var id = event.target.datset.id;

        document.querySelector('.slides').style.webkitTransform = 
            'translate(-' + id + '00% ,0px)';

        nextPosition = Number(id) + 1;
        prevPosition = Number(id) - 1;
        calMobileEvent();
    },
    'click .unregister a': function (event) {
        check(event, $.Event);

        event.preventDefault();
        //Append template:actionUnregisterPrompt to top of ul.actions
    },
    'click .notAccount a.login': function (event) {
        check(event, $.Event);
        event.preventDefault();

        document.body.classList.add('leftSmall');
        document.querySelector('nav.utility li.login').classList.add('active');
        document.querySelector('aside.sidebar section.login').classList.add('active');
    },
    'click .notAccount a.create': function (event) {
        check(event, $.Event);
        event.preventDefault();

        document.body.classList.add('leftSmall');
        document.querySelector('nav.utility li.register').classList.add('active');
        document.querySelector('aside.sidebar section.register').classList.add('active');
    },
    'click span.truncated': function (event) {
        check(event, $.Event);
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    },
    'click .eventSlide .actions .details': function (event) {
        check(event, $.Event);
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    },
    'click .back-to-events': function (event) {
        check(event, $.Event);
        calMobileEvent();
    }
});

/** Admin events */
Template.eventsAdmin.events({
    /**
     * @summary Close Form
     * @method
     *   @param {$.Event} event
     */
    'click button.close': function (event) {
        check(event, $.Event);

        // Close add Event Form
        event.delegateTarget.querySelector('.eventsSlider').classList.remove('hide');
        event.delegateTarget.querySelector('section.addEvent').classList.add('hide');
    }
});

function calMobileEvent() {
    if ( !document.body.classList.contains('active-event') ) {
        document.body.classList.add('active-event');
        document.querySelector('.eventSlide .actions .details').click();
    } else
        document.body.classList.remove('active-event');
}

/**
 * @summary Register Deep-linking
 * @method
 */
Template.events.onRendered(function () {
    // Get db ID from current instance
    var instanceName = this.data.name;

    // Register
    Thriver.history.registry.insert({
        element: Thriver.sections.generateId(instanceName),
        /** Handle deep-linking */
        callback: function (path) {
            Thriver.events.navigate(path);
        }
    });
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {String[]} path - The path by which to navigate
 */
Thriver.events.navigate = function (path) {
    check(path, [String]);

    console.debug('Path:', path);

    var isMonth = false;

    for (let i = 0; i < path.length; ++i) {
        // Year
        if ( path[i].match(/^\d{4}$/) ) {
            Thriver.calendar.thisYear.set( Number( path[i] ) );
            continue;
        }
        // Specific event ID
        if (path[i].match(/^[a-z0-9]{17}$/i) ) {
            // Todo
            continue;
        }
        
        // Check for month
        Thriver.calendar.months.forEach(function (month, index) {
            if (month.toLowerCase() === path[i].toLowerCase() ) {
                Thriver.calendar.thisMonth.set(index);
                isMonth = true;
            }
        });

        if (isMonth) continue;

        // Check for event title
    }
};
