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

    // Set current slide
    currentSlide.set(position);

    // Smooth slide to it
    document.querySelector('.slides').style.webkitTransform =
        'translate(-' + position + '00% ,0px)';
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");

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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
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

        $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
        $(".listViewEvents").removeClass("active");
    },

    'click .listViewEvents': function (event) {
        if ($(event.target).hasClass("active")){
            $(".listViewEventsObjectOpen").removeClass("listViewEventsObjectOpen");
            $(event.target).removeClass("active");
        } else{
            $(".eventsMain").addClass("listViewEventsObjectOpen");
            $(event.target).addClass("active");
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