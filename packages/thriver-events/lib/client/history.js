/**
 * @summary Register Deep-linking
 * @method
 */
Template.events.onRendered(() => {
  // Get db ID from current instance
  const instanceName = Template.instance().data.name;

  // Register
  Thriver.history.registry.insert({
    element: Thriver.sections.generateId(instanceName),
    /** Handle deep-linking */
    callback: path => Thriver.events.parsePath(path),
  });
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {String} id - The ID of an event to navigate to
 */
Thriver.events.navigate = (id) => {
  check(id, String);

  const thisEvent = Thriver.events.collection.findOne({ _id: id });
  let events;

  // Set Month and year based on event Start date
  Thriver.calendar.thisYear.set(thisEvent.start.getFullYear());
  Thriver.calendar.thisMonth.set(thisEvent.start.getMonth());

  // Close any open asides
  $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
  $('.listViewEvents').removeClass('active');
  $('.searchResultsList').removeClass('active');

  // TODO(micchickenburger): Investigate why we're using timers here...
  setTimeout(() => {
    // Get all events for this month
    events = Thriver.events.getThisMonthEvents();

    // Navigate to appropriate slide
    Object.keys(events).forEach((key) => {
      for (let i = 0; i < events[key].length; i += 1) {
        if (events[key][i]._id === id) Thriver.events.slide(events[key][i].position);
      }
    });
  }, 500);

  // Determine URI path
  const parentName = document.querySelector('#main > .events').id;
  const path = `${parentName}/${Thriver.calendar.thisYear.get()}/${Thriver.calendar
    .months[Thriver.calendar.thisMonth.get()]}/${Thriver.sections.generateId(thisEvent.name)}/`;

  // Update URI using History API
  Thriver.history.update(parentName, path);
};

/**
 * @summary Parse URL path for event data
 * @method
 *   @param {String[]} path - The path by which to navigate
 */
Thriver.events.parsePath = (path) => {
  check(path, [String]);

  let isMonth = false;

  for (let i = 0; i < path.length; i += 1) {
    // Year
    if (path[i].match(/^\d{4}$/)) {
      Thriver.calendar.thisYear.set(Number(path[i]));
      continue;
    }
    // Specific event ID
    if (path[i].match(/^[a-z0-9]{17}$/i)) {
      Thriver.events.navigate(path[i]);
      continue;
    }

    // Check for month
    Thriver.calendar.months.forEach((month, index) => {
      if (month.toLowerCase() === path[i].toLowerCase()) {
        Thriver.calendar.thisMonth.set(index);
        isMonth = true;
      }
    });

    if (isMonth) continue;

    // Check for event title
  }
};
