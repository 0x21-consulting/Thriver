SimpleSchema.debug = true;

// Subscribe to events
Meteor.subscribe('events');

/**
 * @summary Toggle `active-event` class for Mobile
 * @method
 */
let calMobileEvent = () => {
    if ( !document.body.classList.contains('active-event') ) {
        document.body.classList.add('active-event');
        //document.querySelector('.eventSlide .actions .details').click();
    } else
        document.body.classList.remove('active-event');
};

// Slide management
Thriver.events.currentSlide = new ReactiveVar(0),
Thriver.events.slideTotal   = new ReactiveVar(0),

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
    Thriver.events.currentSlide.set(position);

    // Smooth slide to it
    if (slides)
        slides.style.webkitTransform = 'translate(-' + position + '00% ,0px)';
};

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
     * @summary Go to previous slide
     * @method
     *   @param {$.Event} event
     */
    'click .sliderPrev': function (event) {
        check(event, $.Event);

        var position = Thriver.events.currentSlide.get() - 1;

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

        var position = Thriver.events.currentSlide.get() + 1;

        // If the position would be greater than the total, switch to next month
        if ( position >= Thriver.events.slideTotal.get() ) {
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
    }
});
