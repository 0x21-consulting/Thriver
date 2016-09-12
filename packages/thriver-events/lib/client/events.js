'use strict';

// Current month and year
var month  = new ReactiveVar(new Date().getMonth()),
    year   = new ReactiveVar(new Date().getFullYear()),
    months = ['January','February','March','April',
              'May','June','July','August','September',
              'October','November','December'],

/**
 * Determine the last date of any given month
 * @function
 *   @param {number} specificMonth - Optional
 * @returns {number}
 */
lastDate = function (specificMonth) {
    // Mutual suspician
    specificMonth = parseInt(specificMonth);
    if (isNaN(specificMonth) || specificMonth < 0 || specificMonth > 11)
        // if invalid month number, just use current month
        specificMonth = month.get();

    // if February
    if (specificMonth === 1) {
        // If the year is divisible by both 4 and 100, but not 400,
        // then it's a leap year
        if (year.get() % 4 === 0)
            if ( (year.get() % 100) === 0 &&
                 (year.get() % 400) !== 0? false : true)
                    return 29;
        return 28;
    }
    // There can't be more than 30 days in April, June, Sept., or Nov.
    if (![3,5,8,10].every(function (val) { return specificMonth !== val; }))
        return 30;

    // All other months
    return 31;
},

/**
 * Get number for month that's prior to current one
 * @function
 * @returns {number}
 */
getLastMonth = function () {
    var lastMonth = month.get() - 1;

    return lastMonth < 0
        ? (12 - Math.abs(lastMonth) % 12) : (lastMonth  % 12);
},

// Subscribe to events
Events = new Mongo.Collection('events');
Meteor.subscribe('events');

// Events helpers
Template.events.helpers({
    /**
     * Return last month
     * @function
     * @returns {string}
     */
    lastMonth: function () {
        var lastMonth = month.get() - 1;

        return months[ getLastMonth() ] + ' ' +
            ( lastMonth < 0 ? (year.get() - 1) : year.get() );
    },
    /**
     * Return next month
     * @function
     * @returns {string}
     */
    nextMonth: function () {
        var nextMonth = month.get() + 1;

        return months[ nextMonth % 12 ] + ' ' +
            (          nextMonth > 11 ?
            (year.get() + 1) : year.get() );
    }
});

// Calendar helpers
Template.calendar.helpers({
    /**
     * Return current month
     * @function
     * @returns {string}
     */
    getMonth: function () {
        return months[ month.get() ];
    },
    /**
     * Return current year
     * @function
     * @returns {number}
     */
    getYear: function () {
        return year.get();
    },
    /**
     * Return weeks and days in the month
     * @function
     * @returns {Day[][]}
     */
    week: function () {
        var firstDay = new Date(year.get(), month.get()).getDay(),
            total    = lastDate(),
            weeks    = [],
            week, day, i, j, count = 0,

            // Last day of last month
            lastMonth = lastDate( getLastMonth() ),

            // Today
            today = new Date(), thisWeek, thisDay,

            // All events this month
            currentEvents = {};

        // Get all events and organize them in an easily-accessible way
        Events.find({
            start: { $gt: new Date( year.get(), month.get() ) },
            end  : { $lt: new Date( year.get(), month.get(), total ) }
        }).forEach(function (event) {
            // If there's no start date, do nothing
            if (! (event.start instanceof Date)) return;

            var start = event.start.getDate(),
                total = 1, i;

            // If there's an end date, calculate total number of days
            if (event.end instanceof Date)
                total = event.end.getDate() - start + 1;

            // For each day, add event info
            for (i = 0; i < total; ++i) {
                // If the date doesn't already exist, add it
                if (! currentEvents[ start + i ])
                    currentEvents[ start + i ] = [];
                // Add event details
                currentEvents[ start + i ].push(event);
            }
        });

        console.debug('Events\n',
            'Greater than', new Date( year.get(), month.get() ), '\n',
            'Less than', new Date( year.get(), month.get(), total ), '\n',
            currentEvents
        );

        // If today is in the current month and year
        if (today.getMonth() === month.get() &&
            today.getFullYear() === year.get()) {
                thisDay  = today.getDate();
                thisWeek = today.getDate() - today.getDay();
            }

        // Create weeks until we reach last day of the month
        do {
            // Create week
            week = [];

            // Create seven days
            for (i = 0; i < 7; ++i) {
                day = {};
                // if we haven't started counting this month yet
                // and this isn't the first day of the month, set
                // the date for last month
                if (!count) {
                    if (i === firstDay)
                        ++count;
                    else {
                        day.notCurrent = 'notCurrent';
                        day.date = lastMonth - (firstDay - i - 1);
                    }
                }
                // If we finished counting (next month's days)
                if (count > total) {
                    day.notCurrent = 'notCurrent';
                    day.date = count - total;
                    ++count;
                }
                // If we have started counting
                if (count && count <= total) {
                    day.date = count;
                    ++count;
                }

                // If today or this week, add special styles
                if (day.date === thisWeek)
                    day.currentWeekStart = 'currentWeekStart';
                if (day.date === thisDay)
                    day.today = 'today';

                // If there are events this day
                if (currentEvents[count] instanceof Array) {
                    day.hasEvent = 'hasEvent';

                    // If the day is in the past
                    if (count < thisDay)
                        day.past = 'past';

                    // Hyperlink first event
                    day.href = currentEvents[count][0]._id;

                    // Add event details
                    // (and convert to array)
                    day.currentEvents = currentEvents[count];
                    console.info('Day', count, day); //debug
                }

                // Add day
                week.push(day);
            }

            // Add week
            weeks.push(week);
        } while (count <= total);

        // Return weeks
        return weeks;
    }
});

// Eoghan's Stuff
var
//currentSlide = 0,
nextPosition = 1,
prevPosition = -1,
slideTotal = 3;

Template.events.events({
    /**
     * Switch to previous month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-prev-month, click .prevMonth': function (event) {
        if ( !(event instanceof $.Event) ) return;

        var lastMonth = month.get() - 1;

        if (lastMonth < 0)
            year.set( year.get() - 1 );

        month.set( getLastMonth() );
    },
    /**
     * Switch to next month
     * @method
     *   @param {$.Event} event
     */
    'click .scroll-next-month, click .nextMonth': function (event) {
        if ( !(event instanceof $.Event) ) return;

        var nextMonth = month.get() + 1;

        if (nextMonth > 11)
            year.set( year.get() + 1);

        month.set(nextMonth % 12);
    },

    // Eoghan's stuff
    'click .sliderPrev': function (event) {
        if (prevPosition >= 0){
            document.querySelector('.slides').style.webkitTransform = "translate(-" + prevPosition + "00% ,0px)";
            prevPosition = prevPosition - 1;
            nextPosition = nextPosition - 1;
        }
    },
    'click .sliderNext': function (event) {
        if (nextPosition < slideTotal){
            document.querySelector('.slides').style.webkitTransform = "translate(-" + nextPosition + "00% ,0px)";
            prevPosition = prevPosition + 1;
            nextPosition = nextPosition + 1;
        }
    },
    'click button.eventDate': function (event) {
        document.querySelector('.slides').style.webkitTransform = "translate(-" + event.target.value + "00% ,0px)";
        nextPosition = Number(event.target.value) + 1;
        prevPosition = Number(event.target.value) - 1;
        calMobileEvent();
    },
    'click a.eventDate': function (event) {
        event.preventDefault();
        document.querySelector('.slides').style.webkitTransform = "translate(-" + event.target.dataset.value + "00% ,0px)";
        nextPosition = Number(event.target.dataset.value) + 1;
        prevPosition = Number(event.target.dataset.value) - 1;
        calMobileEvent();
    },
    'click .unregister a': function (event) {
        event.preventDefault();
        //Append template:actionUnregisterPrompt to top of ul.actions
    },
    'click .notAccount a.login': function (event) {
        event.preventDefault();
        document.body.classList.add('leftSmall');
        $('nav.utility li.login').addClass('active');
        $('aside.sidebar section.login').addClass('active');
    },
    'click .notAccount a.create': function (event) {
        event.preventDefault();
        document.body.classList.add('leftSmall');
        $('nav.utility li.register').addClass('active');
        $('aside.sidebar section.register').addClass('active');
    },
    'click span.truncated': function (event) {
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    },
    'click .eventSlide .actions .details': function (event) {
        $(event.currentTarget).parent().parent().parent().parent().addClass('extendedContent');
    },
    'click .back-to-events': function (event) {
        calMobileEvent();
    }
});



function calMobileEvent(){
    if (!document.body.classList.contains('active-event')){
        document.body.classList.add('active-event');
        document.querySelector('.eventSlide .actions .details').click();
    } else{
        document.body.classList.remove('active-event');
    }
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
            console.debug('Deep-link:', path);
        }
    });
});
