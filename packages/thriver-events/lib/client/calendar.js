/**
 * @summary Calendar namespace
 * @type {Object}
 */
Thriver.calendar = {};

/**
 * @summary ReactiveVar for current slide
 * @type {ReactiveVar}
 */
Thriver.calendar.currentSlide = new ReactiveVar();

// TODO(micchickenburger): This should be internationalized
Thriver.calendar.months = ['January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Current month and year
Thriver.calendar.thisMonth = new ReactiveVar(new Date().getMonth());
Thriver.calendar.thisYear = new ReactiveVar(new Date().getFullYear());

/**
 * Determine the last date of any given month
 * @function
 *   @param {number} specificMonth - Optional
 * @returns {number}
 */
Thriver.calendar.lastDate = (specificMonth) => {
  check(specificMonth, Match.Maybe(Number));

  let month = specificMonth;

  if (isNaN(month) || month < 0 || month > 11) {
    // if invalid month number, just use current month
    month = Thriver.calendar.thisMonth.get();
  }

  // if February
  if (month === 1) {
    // If the year is divisible by both 4 and 100, but not 400,
    // then it's a leap year
    if (Thriver.calendar.thisYear.get() % 4 === 0) {
      if ((Thriver.calendar.thisYear.get() % 100) === 0 &&
          (Thriver.calendar.thisYear.get() % 400) === 0) return 29;
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
Thriver.calendar.getLastMonth = () => {
  const lastMonth = Thriver.calendar.thisMonth.get() - 1;

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
    const lastMonth = Thriver.calendar.thisMonth.get() - 1;
    const month = Thriver.calendar.months[Thriver.calendar.getLastMonth()];
    const year = (lastMonth < 0 ? (Thriver.calendar.thisYear.get() - 1)
      : Thriver.calendar.thisYear.get());

    return `${month} ${year}`;
  },

  /**
   * Return next month
   * @function
   * @returns {string}
   */
  nextMonth: () => {
    const nextMonth = Thriver.calendar.thisMonth.get() + 1;
    const month = Thriver.calendar.months[nextMonth % 12];
    const year = (nextMonth > 11 ? (Thriver.calendar.thisYear.get() + 1)
      : Thriver.calendar.thisYear.get());

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
  getMonth: () => Thriver.calendar.months[Thriver.calendar.thisMonth.get()],

  /**
   * Return current year
   * @function
   * @returns {number}
   */
  getYear: () => Thriver.calendar.thisYear.get(),

  /**
   * Return weeks and days in the month
   * @function
   * @returns {Day[][]}
   */
  week: () => {
    const firstDay = new Date(Thriver.calendar.thisYear.get(),
      Thriver.calendar.thisMonth.get()).getDay();

    const total = Thriver.calendar.lastDate();
    const weeks = [];
    let week;
    let day;
    let count = 0;

    // Last day of last month
    const lastMonth = Thriver.calendar.lastDate(Thriver.calendar.getLastMonth());

    // Today
    const today = new Date();
    let thisWeek;
    let thisDay;

    // All events this month
    const currentEvents = Thriver.events.getThisMonthEvents();

    // If today is in the current month and year
    if (today.getMonth() === Thriver.calendar.thisMonth.get() &&
        today.getFullYear() === Thriver.calendar.thisYear.get()) {
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
        if (day.date === thisDay) day.today = 'today';

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
});
