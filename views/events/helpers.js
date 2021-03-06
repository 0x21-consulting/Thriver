import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Events from '/logic/events/schema';
import Calendar from './calendar';

// Upcoming Events helpers
Template.upcomingEvents.helpers({
  /**
   * @summary List five upcoming events
   * @function
   * @returns {Mongo.Collection}
   */
  upcomingEvents: Events.collection.find(
    { start: { $gt: new Date() } },
    { sort: { start: 1 }, limit: 5 },
  ),
});

// Upcoming Event item Helpers
Template.upcomingEventListItem.helpers({
  /**
   * @summary Show friendly date
   * @function
   * @returns {String}
   */
  friendlyDate: (data) => {
    const shortMonth = Calendar.months[data.start.getMonth()].substr(0, 3);
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
    const month = Calendar.months[date.getMonth()];

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
        date = `${Calendar.months[data.start.getMonth()]} ${data.start.getDate()}`;
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
      date = `${Calendar.months[data.end.getMonth()]} ${data.end.getDate()}`;
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
      if ((data.end instanceof Date && data.end < new Date())
          || (data.start instanceof Date && data.start < new Date())) {
        // Webinar in the past
        return `<a href="${data.location.webinarUrl}" target="_blank">View Recorded Webinar</a>`;
      }
      return `<a href="${data.location.webinarUrl}" target="_blank">Join Webinar</a>`;
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
    Events.collection.find({ start: today }).forEach(addEvent);

    // Get all events that end today
    Events.collection.find({ end: today }).forEach(addEvent);

    // Get all events that both start before today and end after today
    Events.collection.find({
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
    const eventsArray = [];
    Events.sameDayEvents = new ReactiveVar();

    Object.keys(events).forEach(key => eventsArray.push(events[key]));
    Events.sameDayEvents.set(eventsArray);

    return total;
  },

  /**
   * @summary Return same day events
   * @function
   * @returns {Object[]}
   */
  sameDayEvents: () => Events.sameDayEvents.get(),

  /**
   * @summary Return whether sameDayEvents is singular or plural
   * @function
   * @returns {Boolean}
   */
  isSingular: () => !(Events.sameDayEvents.get().length > 1),

  /**
   * @summary Determine which Register Button to Show
   * @function
   * @returns {String}
   */
  registerTemplate: () => {
    const id = Meteor.userId();
    const template = Template.currentData();

    if (id) {
      if (Meteor.user().profile && Meteor.user().profile.events) {
        const events = Meteor.user().profile.events.registeredEvents;
        if (events.length && events.some(event => event.id === template._id)) {
          return 'actionRegistered';
        }
      }

      return 'actionNotRegistered';
    }

    return 'actionNotLoggedIn';
  },
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
   * @summary Current month and year
   * @function
   * @returns {String}
   */
  thisMonth: () => `${Calendar.months[new Date().getMonth()]} ${new Date().getFullYear()}`,

  /**
   * Provide current event data to event slides
   * @function
   * @returns {string[]}
   */
  events: () => {
    // Get all events that start in this month
    const getEvents = (month, year) => Events.collection.find({
      start: {
        $gte: new Date(year, month),
        $lte: new Date(year, month, Calendar.lastDate(month)),
      },
    }, { sort: { start: 1 } }).fetch();

    // No events for this month, so make an empty slide
    const createSlide = (month, year) => {
      let noFutureEvents = false;
      let nextEvent;
      let noPastEvents = false;
      let pastEvent;

      // Are there any future events?
      let events = Events.collection.find({
        start: { $gt: new Date(year, month, Calendar.lastDate()) },
      }, { sort: { start: 1 } });
      if (!events.count()) noFutureEvents = true;
      else nextEvent = events.fetch()[0]._id;

      // Are there any past events?
      events = Events.collection.find({
        start: { $lt: new Date(year, month) },
      }, { sort: { start: -1 } });
      if (!events.count()) noPastEvents = true;
      else pastEvent = events.fetch()[0]._id;

      // Return that slide
      return [{
        _id: `${Calendar.months[month]}-${year}`, // identifying string for slider
        month: Calendar.months[month],
        year,
        noEvents: true,
        noFutureEvents,
        noPastEvents,
        nextEvent,
        pastEvent,
      }];
    };

    // Last month
    let month = Calendar.getLastMonth();
    let year = month === (Calendar.thisMonth.get() - 1)
      ? Calendar.thisYear.get() : Calendar.thisYear.get() - 1;

    let lastMonth = getEvents(month, year);
    if (!lastMonth.length) lastMonth = createSlide(month, year);
    for (let i = 0; i < lastMonth.length; i += 1) lastMonth[i].which = 'lastMonth';

    // This Month
    month = Calendar.thisMonth.get();
    year = Calendar.thisYear.get();

    let thisMonth = getEvents(month, year);
    if (!thisMonth.length) thisMonth = createSlide(month, year);
    for (let i = 0; i < thisMonth.length; i += 1) thisMonth[i].which = 'thisMonth';

    let found = false;
    if (Calendar.currentSlide.get()) {
      for (let i = 0; i < thisMonth.length; i += 1) {
        // Find the slide that should keep the .current class
        if (thisMonth[i]._id === Calendar.currentSlide.get()) {
          thisMonth[i].position = 'current';
          found = true;
          break;
        }
      }
    }
    if (!found) thisMonth[0].position = 'current';

    // Next Month
    month = (Calendar.thisMonth.get() + 1) % 12;
    year = month === Calendar.thisMonth.get() + 1
      ? Calendar.thisYear.get() : Calendar.thisYear.get() + 1;

    let nextMonth = getEvents(month, year);
    if (!nextMonth.length) nextMonth = createSlide(month, year);
    for (let i = 0; i < nextMonth.length; i += 1) nextMonth[i].which = 'nextMonth';

    // Concatenate
    const events = lastMonth.concat(thisMonth, nextMonth);

    // Label prev and next events
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].position === 'current') {
        if (events[i - 1]) events[i - 1].position = 'prev';
        if (events[i + 1]) events[i + 1].position = 'next';
        break;
      }
    }

    return events;
  },
});

// Don't show registration for events which occur in the past
const pastEvent = function pastEvent() {
  // If there is an end date, has the end date passed?
  if (this.end) {
    if (this.end < new Date()) return true;

  // If there is no end date, has the start date passed?
  } else if (this.start < new Date()) return true;

  return false;
};

Template.actionRegistered.helpers({ pastEvent });
Template.actionNotRegistered.helpers({ pastEvent });
