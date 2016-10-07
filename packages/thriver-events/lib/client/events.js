SimpleSchema.debug = true;

// Subscribe to events
Meteor.subscribe('events');

var currentSlide = new ReactiveVar(0),
    slideTotal   = new ReactiveVar(0),
    formMethod   = new ReactiveVar('addEvent'),
    activeEvent  = new ReactiveVar(),

/**
 * @summary Close Event Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
closeForm = function (event) {
    check(event, $.Event);

    // Close add Event Form
    event.delegateTarget.querySelector('.eventsSlider').classList.remove('hide');
    event.delegateTarget.querySelector('section.addEvent').classList.add('hide');
};

//debug
Thriver.currentSlide = currentSlide;
Thriver.slideTotal   = slideTotal;

/** A list of all of today's events */
Thriver.events.sameDayEvents = [];

/**
 * Get all events that start or end in the active month
 * @function
 * @returns {Object}
 */
Thriver.events.getThisMonthEvents = function () {
    var currentEvents = {},
        total = Thriver.calendar.lastDate(),
        count = 0;

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

        // Add slide position
        event.position = count;
        ++count;

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

/**
 * @summary Slide to an event
 * @method
 *   @param {Number} position - Event position to slide to
 */
Thriver.events.slide = function (position) {
    check(position, Number);

    var slides = document.querySelector('.slides');

    // Set current slide
    currentSlide.set(position);

    // Smooth slide to it
    if (slides)
        slides.style.webkitTransform = 'translate(-' + position + '00% ,0px)';
};

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
            slideTotal.set( events.count() );
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
        slideTotal.set(1);

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

// Events template events
Template.events.events({
    /**
     * Switch to previous month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-prev-month, click .prevMonth': function (event) {
        check(event, $.Event);

        var lastMonth  = Thriver.calendar.thisMonth.get() - 1,
            parentName = document.querySelector('#main > .events').id;

        if (lastMonth < 0)
            Thriver.calendar.thisYear.set( Thriver.calendar.thisYear.get() - 1 );

        Thriver.calendar.thisMonth.set( Thriver.calendar.getLastMonth() );

        // Update Location Bar
        Thriver.history.update(parentName,
            parentName                      + '/' +
            Thriver.calendar.thisYear.get() + '/' +
            Thriver.calendar.months[ Thriver.calendar.thisMonth.get()
        ]);

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * Switch to next month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-next-month, click .nextMonth': function (event) {
        check(event, $.Event);

        var nextMonth  = Thriver.calendar.thisMonth.get() + 1,
            parentName = document.querySelector('#main > .events').id;

        if (nextMonth > 11)
            Thriver.calendar.thisYear.set( Thriver.calendar.thisYear.get() + 1);

        Thriver.calendar.thisMonth.set(nextMonth % 12);

        // Update Location Bar
        Thriver.history.update(parentName,
            parentName                      + '/' +
            Thriver.calendar.thisYear.get() + '/' +
            Thriver.calendar.months[ Thriver.calendar.thisMonth.get()
        ]);

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary Search for events
     * @param {$.Event} event
     */
    'keyup #eventSearch': function (event) {
        check(event, $.Event);

        if (event.target.value){
            document.querySelector('.searchResultsList').classList.add('active');
        } else{
            document.querySelector('.searchResultsList').classList.remove('active');
        }
    },

    /**
     * @summary Show Event Add Form
     * @method
     *   @param {$.Event} event
     */
    'click li.addEvent': function (event) {
        check(event, $.Event);

        // Set appropriate form type
        formMethod.set('addEvent');
        activeEvent.set(null);

        var slider = event.delegateTarget.querySelector('.eventsSlider'),
            admin  = event.delegateTarget.querySelector('section.addEvent');

        if (slider instanceof Element)
            slider.classList.add('hide');
        if (admin instanceof Element)
            admin.classList.remove('hide');

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary Go to previous slide
     * @method
     *   @param {$.Event} event
     */
    'click .sliderPrev': function (event) {
        check(event, $.Event);

        var position = currentSlide.get() - 1;

        // If the position would be less than zero, go to last month
        if (position < 0) {
            document.querySelector('.prevMonth').click();
            return;
        }

        Thriver.events.slide(position);

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary Go to next slide
     * @method
     *   @param {$.Event} event
     */
    'click .sliderNext': function (event) {
        check(event, $.Event);

        var position = currentSlide.get() + 1;

        // If the position would be greater than the total, switch to next month
        if ( position >= slideTotal.get() ) {
            document.querySelector('.nextMonth').click();
            return;
        }

        Thriver.events.slide(position);

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary Navigate to an event from the calendar
     * @method
     *   @param {$.Event} event
     */
    'click button.eventDate': function (event) {
        check(event, $.Event);

        Thriver.events.navigate( event.target.dataset.id );

        // Something to do with Mobile
        calMobileEvent();

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary Navigate to an event from Upcoming Events list
     * @method
     *   @param {$.Event} event
     */
    'click a.eventDate': function (event) {
        check(event, $.Event);
        event.preventDefault();

        Thriver.events.navigate( event.target.dataset.id );

        // Something to do with Mobile
        calMobileEvent();

        $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
        $('.listViewEvents').removeClass('active');
    },

    /**
     * @summary When clicking the View All button
     * @method
     *   @param {$.Event} event
     */
    'click .listViewEvents': function (event) {
        check(event, $.Event);

        // Close
        if (event.target.classList.contains('active')) {
            document.querySelector('.listViewEventsObjectOpen').classList.remove('listViewEventsObjectOpen');
            event.target.classList.remove('active');

        // Open
        } else {
            let main = document.querySelector('.eventsMain');

            main.classList.add('listViewEventsObjectOpen');
            event.target.classList.add('active');

            // Click first tab for convenience
            main.querySelector('.tabs > li > a').click();
        }
    },

    //
    // TODO
    //
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
            events = Thriver.events.collection.find({ start: { 
                $gte: new Date(year, month, date),
                $lt : new Date(year, month + 1) } }),

            count = events.count(),

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
    },
    /**
     * @summary Return a friendly date range for the upcoming events badge
     * @function
     *   @param {Date} start
     *   @param {Date} end
     * @returns {String}
     */
    friendly: function (start, end) {
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
    }
});

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
            events = Thriver.events.collection.find({ start: { 
                $lt : new Date(year, month, date),
                $gte: new Date(year, month - 1) } }),

            count = events.count(),

            futureEvents = [];

        // Until there are no events left
        while ( count ) {
            // Add this months' events
            // If there are no events this month, don't add anything
            if ( events.count() )
                futureEvents.push({
                    month : month - 1 < 0? Thriver.calendar.months[11] 
                          : Thriver.calendar.months[ month - 1 ],
                    year  : month - 1 < 0? year - 1: year,
                    event: events.fetch()
                });

            // Advance month & year
            year  = month - 1 < 0 ? year - 1 : year;
            month = month - 1 < 0 ? 11 : month - 1;

            // Get new events
            events = Thriver.events.collection.find({ start: {
                $lt : new Date(year, month),
                $gte: new Date(year, month - 1) } });

            // For while loop, in case there are months with no events
            // but still some events in the future at some point
            count = Thriver.events.collection.find({ start: {
                $lt: new Date(year, month) }}).count();
        }

        return futureEvents;
    },
    /**
     * @summary Return a friendly date range for the upcoming events badge
     * @function
     *   @param {Date} start
     *   @param {Date} end
     * @returns {String}
     */
    friendly: function (start, end) {
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
    }
});

/** Admin Helpers */
Template.eventsAdmin.helpers({
    /**
     * @summary Meteor Method to call on submit
     * @function
     * @returns {String}
     */
    method: function () {
        return formMethod.get();
    },

    /**
     * @summary Document context for updates
     * @function
     * @returns {Object}
     */
    doc: function () {
        return activeEvent.get();
    }
});

/** Admin events */
Template.eventsAdmin.events({
    /**
     * @summary Close Form
     */
    'click button.close': closeForm,
    'submit #eventForm' : closeForm
});

/** Event Slide Events */
Template.eventSlide.events({
    /**
     * @summary Register for Event
     * @method
     *   @param {$.Event} event
     */
    'click li.register': function (event) {
        check(event, $.Event);

        var a;

        // If this is a third-party register link, navigate to it
        if (this.registerUrl) {
            // Create link
            a = document.createElement('a');
            a.href = this.registerUrl;
            a.target = '_blank';            // new tab
            a.classList.add('hide');        // keep hidden on page
            document.body.appendChild(a);   // Required for Mozilla to click

            a.click();
            a.remove();
        } else{
            var el = `
                <li class="registration-form">
                    <h2>Event Registration</h2>
                    <form>
                        <label for="name">Name</label>
                        <input type="text" name="name" />
                        <label for="email">Email</label>
                        <input type="text" name="email" />
                        <input type="submit" value="Register" />
                    </form>
                </li>`
            ;
            $(event.target).parent().append(el); // add it to the div
            $(event.target).remove();
        }

        // TODO:  Add event to profile
    },

    /**
     * @summary Edit Event
     * @method
     *   @param {$.Event} event
     */
    'click .adminControls .edit': function (event) {
        check(event, $.Event);

        var eventsSlider;

        // Set form type to Update
        formMethod.set('updateEvent');
        activeEvent.set(this);

        // Hide Slider and show admin interface
        eventsSlider = event.delegateTarget.parentElement.parentElement;
        eventsSlider.classList.add('hide');
        eventsSlider.parentElement.querySelector('section.addEvent').
            classList.remove('hide');
    },

    /**
     * @summary Delete Event
     * @method
     *   @param {$.Event} event
     */
    'click .adminControls .delete': function (event) {
        check(event, $.Event);

        if ( confirm('Are you sure you want to delete this event?') )
            Meteor.call('deleteEvent', this._id);
    }
});

function calMobileEvent() {
    if ( !document.body.classList.contains('active-event') ) {
        document.body.classList.add('active-event');
        //document.querySelector('.eventSlide .actions .details').click();
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
            Thriver.events.parsePath(path);
        }
    });
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {String} id - The ID of an event to navigate to
 */
Thriver.events.navigate = function (id) {
    check(id, String);

    var thisEvent  = Thriver.events.collection.findOne({ _id: id }),
        events, parentName, path;

    // Set Month and year based on event Start date
    Thriver.calendar.thisYear .set( thisEvent.start.getFullYear() );
    Thriver.calendar.thisMonth.set( thisEvent.start.getMonth   () );

    // Get all events for this month
    events = Thriver.events.getThisMonthEvents();

    // Navigate to appropriate slide
    for (let event in events)
        for (let i = 0; i < events[ event ].length; ++i)
            if (events[ event ][i]._id === id)
                Thriver.events.slide( events[ event ][i].position );

    // Determine URI path
    parentName = document.querySelector('#main > .events').id;
    path =
        parentName                                      + '/' +
        Thriver.calendar.thisYear.get()                 + '/' +
        Thriver.calendar.months[
            Thriver.calendar.thisMonth.get() ]          + '/' +
        Thriver.sections.generateId( thisEvent.name )   + '/' ;

    // Update URI using History API
    Thriver.history.update(parentName, path);
};

/**
 * @summary Parse URL path for event data
 * @method
 *   @param {String[]} path - The path by which to navigate
 */
Thriver.events.parsePath = function (path) {
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
            Thriver.events.navigate( path[i] );
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