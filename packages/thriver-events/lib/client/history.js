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

    // Close any open asides
    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
    $('.searchResultsList').removeClass('active');

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
