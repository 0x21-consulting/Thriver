/**
 * @summary Register Deep-linking
 * @method
 */
Template.events.onRendered(() => {
  // Get db ID from current instance
  const instanceName = Template.instance().data.name;

  // Register
  if (instanceName) {
    Thriver.history.registry.insert({
      element: Thriver.sections.generateId(instanceName),
      /** Handle deep-linking */
      callback: path => Thriver.events.parsePath(path),
    });
  }
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {String} id - The ID of an event to navigate to
 */
Thriver.events.navigate = (id) => {
  check(id, String);

  const thisEvent = Thriver.events.collection.findOne({ _id: id });

  // Set Month and year based on event Start date
  Thriver.calendar.currentSlide.set(id);
  Thriver.calendar.thisYear.set(thisEvent.start.getFullYear());
  Thriver.calendar.thisMonth.set(thisEvent.start.getMonth());

  // Close any open asides
  $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
  $('.listViewEvents').removeClass('active');
  $('.searchResultsList').removeClass('active');

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

  /**
   * @summary Return whether a string is a valid month
   * @function
   *   @param {String} month
   *   @param {Number} index
   */
  const isMonth = i =>
    (month, index) => {
      if (month.toLowerCase() === path[i].toLowerCase()) {
        Thriver.calendar.thisMonth.set(index);
        return true;
      }
      return false;
    };

  for (let i = 0; i < path.length; i += 1) {
    // Year
    if (path[i].match(/^\d{4}$/)) {
      Thriver.calendar.thisYear.set(Number(path[i]));
    }
    // Specific event ID
    if (path[i].match(/^[a-z0-9]{17}$/i)) {
      Thriver.events.navigate(path[i]);
    }

    // Check for month
    Thriver.calendar.months.forEach(isMonth(i));

    // TODO(micchickenburger): Check for event title
  }
};
