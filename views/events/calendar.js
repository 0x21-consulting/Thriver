import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Events from './events';

/**
 * @summary Calendar namespace
 * @type {Object}
 */
const Calendar = {};

/**
 * @summary ReactiveVar for current slide
 * @type {ReactiveVar}
 */
Calendar.currentSlide = new ReactiveVar();

// TODO(micchickenburger): This should be internationalized
Calendar.months = ['January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Current month and year
Calendar.thisMonth = new ReactiveVar(new Date().getMonth());
Calendar.thisYear = new ReactiveVar(new Date().getFullYear());

/**
 * Determine the last date of any given month
 * @function
 *   @param {number} specificMonth - Optional
 * @returns {number}
 */
Calendar.lastDate = (specificMonth) => {
  let month = specificMonth;

  if (Number.isNaN(month) || month < 0 || month > 11) {
    // if invalid month number, just use current month
    month = Calendar.thisMonth.get();
  }

  // if February
  if (month === 1) {
    // If the year is divisible by both 4 and 100, but not 400,
    // then it's a leap year
    if (Calendar.thisYear.get() % 4 === 0) {
      if ((Calendar.thisYear.get() % 100) === 0
        && (Calendar.thisYear.get() % 400) === 0) return 29;
    }
    return 28;
  }

  // There can't be more than 30 days in April, June, Sept., or Nov.
  if (![3, 5, 8, 10].every(val => month !== val)) return 30;

  // All other months
  return 31;
};

/**
 * Get number for month that's prior to current one
 * @function
 * @returns {number}
 */
Calendar.getLastMonth = () => {
  const lastMonth = Calendar.thisMonth.get() - 1;

  return lastMonth < 0 ? (12 - (Math.abs(lastMonth) % 12))
    : (lastMonth % 12);
};

// Events Template helpers
Template.events.helpers({
  /**
   * Return last month
   * @function
   * @returns {string}
   */
  lastMonth: () => {
    const lastMonth = Calendar.thisMonth.get() - 1;
    const month = Calendar.months[Calendar.getLastMonth()];
    const year = (lastMonth < 0 ? (Calendar.thisYear.get() - 1)
      : Calendar.thisYear.get());

    return `${month} ${year}`;
  },

  /**
   * Return next month
   * @function
   * @returns {string}
   */
  nextMonth: () => {
    const nextMonth = Calendar.thisMonth.get() + 1;
    const month = Calendar.months[nextMonth % 12];
    const year = (nextMonth > 11 ? (Calendar.thisYear.get() + 1)
      : Calendar.thisYear.get());

    return `${month} ${year}`;
  },
});

// Calendar helpers
Template.calendar.helpers({
  /**
   * Return current month
   * @function
   * @returns {string}
   */
  getMonth: () => Calendar.months[Calendar.thisMonth.get()],

  /**
   * Return current year
   * @function
   * @returns {number}
   */
  getYear: () => Calendar.thisYear.get(),

  /**
   * Return weeks and days in the month
   * @function
   * @returns {Day[][]}
   */
  week: () => {
    const firstDay = new Date(
      Calendar.thisYear.get(),
      Calendar.thisMonth.get(),
    ).getDay();

    const total = Calendar.lastDate();
    const weeks = [];
    let week;
    let day;
    let count = 0;

    // Last day of last month
    const lastMonth = Calendar.lastDate(Calendar.getLastMonth());

    // Today
    const today = new Date();
    let thisWeek;
    let thisDay;

    // All events this month
    const currentEvents = Events.getThisMonthEvents();

    // If today is in the current month and year
    if (today.getMonth() === Calendar.thisMonth.get()
        && today.getFullYear() === Calendar.thisYear.get()) {
      thisDay = today.getDate();
      thisWeek = today.getDate() - today.getDay();
    }

    // Create weeks until we reach last day of the month
    do {
      // Create week
      week = [];

      // Create seven days
      for (let i = 0; i < 7; i += 1) {
        day = {};

        // if we haven't started counting this month yet
        // and this isn't the first day of the month, set
        // the date for last month
        if (!count) {
          if (i === firstDay) count += 1;
          else {
            day.notCurrent = 'notCurrent';
            day.date = lastMonth - (firstDay - i - 1);
          }
        }

        // If we have started counting
        if (count && count <= total) day.date = count;

        // If today or this week, add special styles
        if (day.date === thisWeek && i === 0) day.currentWeekStart = 'currentWeekStart';
        if (day.date === thisDay && day.date === count) day.today = 'today';

        // If we finished counting (next month's days)
        if (count > total) {
          day.notCurrent = 'notCurrent';
          day.currentWeekStart = '';
          day.today = '';
          day.date = count - total;
          count += 1;
        }

        // If there are events this day
        if (currentEvents[count] instanceof Array) {
          day.hasEvent = 'hasEvent';

          // If the day is in the past
          if (count < thisDay) day.past = 'past';

          // If the day is an awareness day
          if (currentEvents[count][0].awareness === 'day'
            || currentEvents[count][0].awareness === 'month') day.awareness = 'awareness';

          // Hyperlink first event
          day.id = currentEvents[count][0]._id;

          // Add event details
          // (and convert to array)
          day.currentEvents = currentEvents[count];
        }

        // If we have started counting
        if (count && count <= total) count += 1;

        // Add day
        week.push(day);
      }

      // Add week
      weeks.push(week);
    } while (count <= total);

    // Return weeks
    return weeks;
  },

  /**
   * @summary Determine if this is an Awareness Month
   * @method
   */
  awareness: () => {
    const year = Calendar.thisYear.get();
    const month = Calendar.thisMonth.get();

    const count = Events.collection.find({
      start: {
        $gte: new Date(year, month),
        $lte: new Date(year, month, Calendar.lastDate(month)),
      },
      awareness: 'month',
    }).count();

    if (count) return 'awareness';
    return '';
  },

  /**
   * @summary Pass On Awareness Events
   * @method
   */
  awarenessEvents: () => {
    const year = Calendar.thisYear.get();
    const month = Calendar.thisMonth.get();

    const events = Events.collection.find({
      start: {
        $gte: new Date(year, month),
        $lte: new Date(year, month, Calendar.lastDate(month)),
      },
      awareness: 'month',
    });

    return events;
  },
});

// Calendar Events
Template.calendar.events({
  /**
   * @summary Navigate on click for event links
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    // Do nothing else
    event.preventDefault();

    // Navigate
    Events.navigate(event.currentTarget.dataset.id);
  },
});

export default Calendar;
