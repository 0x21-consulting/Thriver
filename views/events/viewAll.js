import { Template } from 'meteor/templating';
import Calendar from './calendar';
import Events from '/logic/events/schema';

/**
 * @summary Return a friendly date range for the upcoming events badge
 * @function
 *   @param {Date} start
 *   @param {Date} end
 * @returns {String}
 */
Template.registerHelper('friendly', (start, end) => {
  let string = '';

  /**
   * @summary Return 'st', 'nd', 'rd', or 'th' for dates
   * @function
   *   @param {Number} date
   * @returns {String}
   */
  const nth = (date) => {
    if (date === 1 || date === 21 || date === 31) return 'st';
    if (date === 2 || date === 22) return 'nd';
    if (date === 3 || date === 23) return 'rd';

    return 'th';
  };

  // Start string with abbriviated month and date
  string += `${Calendar.months[start.getMonth()].substr(0, 3)} ${start.getDate()}`;

  // 1st, 2nd, 3rd, or nth
  string += nth(start.getDate());

  // If the event ends on a different day than it starts, create a range
  if (end instanceof Date) {
    if (start.toDateString() !== end.toDateString()) {
      // Add the hyphen
      string += '-';

      // If year or month differ, then show the month
      if (start.getFullYear() !== end.getFullYear()
          || start.getMonth() !== end.getMonth()) {
        string += `${Calendar.months[end.getMonth()].substr(0, 3)} `;
      }

      // Now display the date
      string += end.getDate() + nth(end.getDate());
    }
  }

  return string;
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {$.Event} event
 */
const navigate = (event) => {
  // Do nothing else
  event.preventDefault();

  // Navigate
  Events.navigate(event.currentTarget.dataset.id);
};

/** View All Templates events */
Template.pastEventsList.events({ 'click a': navigate });
Template.upcomingEventsList.events({ 'click a': navigate });

/** Past Events under `View All` helpers */
Template.pastEventsList.helpers({
  /**
   * @summary Return all past events
   * @function
   * @returns {Meteor.Collection}
   */
  pastEvents: () => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    const date = new Date().getDate();

    // This month's events
    let events = Events.collection.find(
      {
        start: {
          $lt: new Date(year, month, date),
          $gte: new Date(year, month),
        },
      },
      { sort: { start: -1 } },
    );

    // Count of all previous events
    let count = Events.collection.find({
      start: {
        $lt: new Date(year, month, date),
      },
    }).count();

    const futureEvents = [];

    // Until there are no events left
    while (count) {
      // Add this months' events
      // If there are no events this month, don't add anything
      if (events.count()) {
        futureEvents.push({
          month: Calendar.months[month],
          year,
          event: events.fetch(),
        });
      }

      // Advance month & year
      year = month - 1 < 0 ? year - 1 : year;
      month = month - 1 < 0 ? 11 : month - 1;

      // Get new events
      events = Events.collection.find(
        {
          start: {
            $lt: new Date(year, month + 1),
            $gte: new Date(year, month),
          },
        },
        { sort: { start: -1 } },
      );

      // For while loop, in case there are months with no events
      // but still some events in the future at some point
      count = Events.collection
        .find({ start: { $lt: new Date(year, month + 1) } }).count();
    }

    return futureEvents;
  },
});

/** Upcoming Events under `View All` helpers */
Template.upcomingEventsList.helpers({
  /**
   * @summary Return all upcoming events
   * @function
   * @returns {Meteor.Collection}
   */
  upcomingEvents: () => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    const date = new Date().getDate();

    // This month's events
    let events = Events.collection.find({
      start: {
        $gte: new Date(year, month, date),
        $lt: new Date(year, month + 1),
      },
    });

    // Count of all future events
    let count = Events.collection
      .find({ start: { $gte: new Date(year, month) } }).count();

    const futureEvents = [];

    // Until there are no events left
    while (count) {
      // Add this months' events
      // If there are no events this month, don't add anything
      if (events.count()) {
        futureEvents.push({
          month: Calendar.months[month],
          year,
          event: events.fetch(),
        });
      }

      // Advance month & year
      year = month + 1 > 11 ? year + 1 : year;
      month = (month + 1) % 12;

      // Get new events
      events = Events.collection.find({
        start: {
          $gte: new Date(year, month),
          $lt: new Date(year, month + 1),
        },
      });

      // For while loop, in case there are months with no events
      // but still some events in the future at some point
      count = Events.collection
        .find({ start: { $gte: new Date(year, month) } }).count();
    }

    return futureEvents;
  },
});
