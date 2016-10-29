// Upcoming Events helpers
Template.upcomingEvents.helpers({
  /**
   * @summary List five upcoming events
   * @function
   * @returns {Mongo.Collection}
   */
  upcomingEvents: Thriver.events.collection.find({ start: { $gt: new Date() } },
    { sort: { start: 1 }, limit: 5 }),
});

// Upcoming Event item Helpers
Template.upcomingEventListItem.helpers({
  /**
   * @summary Show friendly date
   * @function
   * @returns {String}
   */
  friendlyDate: (data) => {
    const shortMonth = Thriver.calendar.months[data.start.getMonth()].substr(0, 3);
    return `${shortMonth} ${data.start.getDate()}`;
  },
});

// Event Details helpers
Template.eventSlide.helpers({
  /**
   * @summary Show Start Date
   * @function
   * @returns {String}
   */
  startDate: (data) => {
    const date = data.start;
    const month = Thriver.calendar.months[date.getMonth()];

    return `${month} ${date.getDate()}, ${date.getFullYear()}`;
  },

  /**
   * @summary Show Start Time
   * @function
   * @returns {String}
   */
  startTime: (data) => {
    const time = data.start;
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let am = false;
    let date = '';

    // If the event spans multiple days, include the date
    if (data.end instanceof Date) {
      if (data.start.getDate() !== data.end.getDate()) {
        date = `${Thriver.calendar.months[data.start.getMonth()]} ${data.start.getDate()}`;
        return date;
      }
    }

    // Determine morning or evening
    if (hour === (hour % 12)) am = true;

    // Convert to 12 hour clock
    if (hour % 12 === 0) hour = 12;
    else hour %= 12;

    // Format with leading zero if necessary
    if (hour.toString().length < 2) hour = `0${hour}`;

    // Same for minutes
    if (minutes.toString().length < 2) minutes = `0${minutes}`;

    return `${hour}:${minutes} ${am ? 'AM' : 'PM'}`;
  },

  /**
   * @summary Show End Date and time
   * @function
   * @returns {String}
   */
  endTime: (data) => {
    // Do nothing if no date is set
    if (!(data.end instanceof Date)) return '';

    const time = data.end;
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let am = false;
    let date = '';

    // If the event spans multiple days, include the date
    if (data.start.getDate() !== data.end.getDate()) {
      date = `${Thriver.calendar.months[data.end.getMonth()]} ${data.end.getDate()}`;
      return ` — ${date}`;
    }

    // Determine morning or evening
    if (hour === (hour % 12)) am = true;

    // Convert to 12 hour clock
    if (hour % 12 === 0) hour = 12;
    else hour %= 12;

    // Format with leading zero if necessary
    if (hour.toString().length < 2) hour = `0${hour}`;

    // Same for minutes
    if (minutes.toString().length < 2) minutes = `0${minutes}`;

    return ` - ${hour}:${minutes} ${am ? 'AM' : 'PM'}`;
  },

  /**
   * @summary Create a link for address
   * @function
   * @returns {String}
   */
  address: (data) => {
    // If this is a web link
    if (data.location.webinarUrl) {
      return `<a href="${data.location.webinarUrl}" target="_blank">Online</a>`;
    }

    if (data.location.mapUrl) {
      return `<a href="${data.location.mapUrl}" target="_blank">${data.location.name}</a>`;
    }

    // Otherwise, just return the name
    return data.location.name;
  },

  /**
   * @summary Display number of other events occurring on same day
   * @function
   * @returns {Number}
   */
  numberSameDayEvents: (data) => {
    // We use a list here instead of just a db count because an event that
    // starts today can also end today, creating a duplicate.

    // The list
    const events = {};

    // For each event, add ID to list
    const addEvent = (event) => {
      // Don't include this event
      if (data._id === event._id) return;

      // Else, add
      events[event._id] = event;
    };

    // toDateString() removes time data, going to midnight today
    const yesterday = new Date(data.start.toDateString());
    const tomorrow = new Date(new Date(yesterday).setDate(yesterday.getDate() + 1));

    // Today is clearly between yesterday and tomorrow
    const today = { $gte: yesterday, $lte: tomorrow };

    // Total count
    let total = 0;

    // Get all events that start today
    Thriver.events.collection.find({ start: today }).forEach(addEvent);

    // Get all events that end today
    Thriver.events.collection.find({ end: today }).forEach(addEvent);

    // Get all events that both start before today and end after today
    Thriver.events.collection.find({
      start: {
        // Before today at midnight
        $lt: new Date(data.start.toDateString()),
      },
      end: {
        // After today at 11:59:59 PM
        $gt: new Date(`${data.start.toDateString()} 23:59:59`),
      },
    }).forEach(addEvent);

    // Total number of events for today
    total = Object.keys(events).length;

    // Now store as array for other helpers
    Thriver.events.sameDayEvents = [];

    Object.keys(events).forEach(key =>
      Thriver.events.sameDayEvents.push(events[key]));

    return total;
  },

  /**
   * @summary Return same day events
   * @function
   * @returns {Object[]}
   */
  sameDayEvents: Thriver.events.sameDayEvents,

  /**
   * @summary Return whether sameDayEvents is singular or plural
   * @function
   * @returns {Boolean}
   */
  isSingular: !(Thriver.events.sameDayEvents.length > 1),
});

// Events helpers
Template.events.helpers({
  // Temp Future/Past Content
  // TODO(eoghantadhg): Determine where this should go
  items: [{
    // Need to find away to get background images in here
    tabs: [{ // If sidebar has tabs: use this property
      title: 'Upcoming Events',
      id: 'upcomingEventsList', // These are for aria-controls
      template: 'upcomingEventsList',
    }, {
      title: 'Past Events',
      id: 'pastEventsList',
      template: 'pastEventsList',
    }],
  }],

  /**
   * Provide current event data to event slides
   * @function
   * @returns {string[]}
   */
  events: () => {
    let noPastEvents;
    let noFutureEvents;

    // Get all events that start or end in this month
    let events = Thriver.events.collection.find({
      $or: [{
        start: {
          $gte: new Date(Thriver.calendar.thisYear.get(),
            Thriver.calendar.thisMonth.get()),
          $lt: new Date(Thriver.calendar.thisYear.get(),
            Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate()),
        } }, {
          end: {
            $gte: new Date(Thriver.calendar.thisYear.get(),
              Thriver.calendar.thisMonth.get()),
            $lt: new Date(Thriver.calendar.thisYear.get(),
              Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate()),
          },
        }],
    }, { sort: { start: 1 } });

    // Update total for slides
    if (events.count()) {
      Thriver.events.slideTotal.set(events.count());
      Thriver.events.slide(0);
      return events;
    }

    // No slide this month

    // Are there any future events?
    events = Thriver.events.collection.find({
      start: {
        $gt: new Date(
          Thriver.calendar.thisYear.get(),
          Thriver.calendar.thisMonth.get(), Thriver.calendar.lastDate()),
      },
    });
    if (!events.count()) noFutureEvents = true;

    // Are there any past events?
    events = Thriver.events.collection.find({
      end: {
        $lt: new Date(Thriver.calendar.thisYear.get(),
          Thriver.calendar.thisMonth.get()),
      },
    });
    if (!events.count()) noPastEvents = true;

    // Now we only have one slide
    Thriver.events.slideTotal.set(1);

    // Return that slide
    Thriver.events.slide(0);
    return [{
      month: Thriver.calendar.months[Thriver.calendar.thisMonth.get()],
      year: Thriver.calendar.thisYear.get(),
      noEvents: true,
      noFutureEvents,
      noPastEvents,
    }];
  },
});
