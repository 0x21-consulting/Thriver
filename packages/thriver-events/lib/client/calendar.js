/**
 * @summary Calendar namespace
 * @type {Object}
 */
Thriver.calendar = {};

// TODO: This should be internationalized
Thriver.calendar.months = 
    [ 'January'  , 'February', 'March'   , 'April'    ,
      'May'      , 'June'    , 'July'    , 'August'   ,
      'September', 'October' , 'November', 'December' ];

// Current month and year
Thriver.calendar.thisMonth = new ReactiveVar( new Date().getMonth()    );
Thriver.calendar.thisYear  = new ReactiveVar( new Date().getFullYear() );

/**
 * Determine the last date of any given month
 * @function
 *   @param {number} specificMonth - Optional
 * @returns {number}
 */
Thriver.calendar.lastDate = function (specificMonth) {
    check(specificMonth, Match.Maybe(Number) );

    if (isNaN(specificMonth) || specificMonth < 0 || specificMonth > 11)
        // if invalid month number, just use current month
        specificMonth = Thriver.calendar.thisMonth.get();

    // if February
    if (specificMonth === 1) {
        // If the year is divisible by both 4 and 100, but not 400,
        // then it's a leap year
        if (Thriver.calendar.thisYear.get() % 4 === 0)
            if ( (Thriver.calendar.thisYear.get() % 100) === 0 &&
                 (Thriver.calendar.thisYear.get() % 400) !== 0? false : true)
                    return 29;
        return 28;
    }
    // There can't be more than 30 days in April, June, Sept., or Nov.
    if (![3,5,8,10].every(function (val) { return specificMonth !== val; }))
        return 30;

    // All other months
    return 31;
};

/**
 * Get number for month that's prior to current one
 * @function
 * @returns {number}
 */
Thriver.calendar.getLastMonth = function () {
    var lastMonth = Thriver.calendar.thisMonth.get() - 1;

    return lastMonth < 0
        ? (12 - Math.abs(lastMonth) % 12) : (lastMonth  % 12);
};

// Events Template helpers
Template.events.helpers({
    /**
     * Return last month
     * @function
     * @returns {string}
     */
    lastMonth: function () {
        var lastMonth = Thriver.calendar.thisMonth.get() - 1;

        return Thriver.calendar.months[ Thriver.calendar.getLastMonth() ] + ' ' +
            ( lastMonth < 0 ? (Thriver.calendar.thisYear.get() - 1) 
                : Thriver.calendar.thisYear.get() );
    },
    /**
     * Return next month
     * @function
     * @returns {string}
     */
    nextMonth: function () {
        var nextMonth = Thriver.calendar.thisMonth.get() + 1;

        return Thriver.calendar.months[ nextMonth % 12 ] + ' ' +
            (          nextMonth > 11 ?
            (Thriver.calendar.thisYear.get() + 1) : Thriver.calendar.thisYear.get() );
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
        return Thriver.calendar.months[ Thriver.calendar.thisMonth.get() ];
    },
    /**
     * Return current year
     * @function
     * @returns {number}
     */
    getYear: function () {
        return Thriver.calendar.thisYear.get();
    },
    /**
     * Return weeks and days in the month
     * @function
     * @returns {Day[][]}
     */
    week: function () {
        var firstDay = new Date(Thriver.calendar.thisYear.get(), 
            Thriver.calendar.thisMonth.get()).getDay(),

            total    = Thriver.calendar.lastDate(),
            weeks    = [],
            week, day, i, j, count = 0,

            // Last day of last month
            lastMonth = Thriver.calendar.lastDate( Thriver.calendar.getLastMonth() ),

            // Today
            today = new Date(), thisWeek, thisDay,

            // All events this month
            currentEvents = Thriver.events.getThisMonthEvents();

        console.debug('Events\n',
            'Greater than', new Date( Thriver.calendar.thisYear.get(), 
                Thriver.calendar.thisMonth.get() ), '\n',
            'Less than', new Date( Thriver.calendar.thisYear.get(), 
                Thriver.calendar.thisMonth.get(), total ), '\n',
            currentEvents
        );

        // If today is in the current month and year
        if (today.getMonth() === Thriver.calendar.thisMonth.get() &&
            today.getFullYear() === Thriver.calendar.thisYear.get() ) {
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
                if (count && count <= total)
                    day.date = count;

                // If today or this week, add special styles
                if (day.date === thisWeek)
                    day.currentWeekStart = 'currentWeekStart';
                if (day.date === thisDay)
                    day.today = 'today';

                // If there are events this day
                if (currentEvents[count] instanceof Array) {
                    day.hasEvent = 'hasEvent';

                    // If the day is in the past
                    if ( count < thisDay)
                        day.past = 'past';

                    // Hyperlink first event
                    day.href = currentEvents[count][0]._id;

                    // Add event details
                    // (and convert to array)
                    day.currentEvents = currentEvents[count];
                    console.info('Day', count, day); //debug
                }

                // If we have started counting
                if (count && count <= total)
                    count++;

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
