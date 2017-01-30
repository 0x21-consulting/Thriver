// TODO(micchickenburger): Turn off debugging for production
SimpleSchema.debug = true;

// Subscribe to events
Meteor.subscribe('events');

/**
 * @summary Toggle `active-event` class for Mobile
 * @method
 */
const calMobileEvent = () => {
  if (!document.body.classList.contains('active-event')) {
    document.body.classList.add('active-event');
  } else document.body.classList.remove('active-event');
};

// Slide management
Thriver.events.currentSlide = new ReactiveVar(0);
Thriver.events.slideTotal = new ReactiveVar(0);

/** A list of all of today's events */
Thriver.events.sameDayEvents = [];

/**
 * Get all events that start or end in the active month
 * @function
 * @returns {Object}
 */
Thriver.events.getThisMonthEvents = () => {
  const currentEvents = {};
  const total = Thriver.calendar.lastDate();
  let count = 0;

  // Get all events and organize them in an easily-accessible way
  Thriver.events.collection.find({
    $or: [{
      start: {
        $gte: new Date(Thriver.calendar.thisYear.get(),
          Thriver.calendar.thisMonth.get()),
        $lte: new Date(Thriver.calendar.thisYear.get(),
          Thriver.calendar.thisMonth.get(), total),
      } }, {
        end: {
          $gte: new Date(Thriver.calendar.thisYear.get(),
            Thriver.calendar.thisMonth.get()),
          $lte: new Date(Thriver.calendar.thisYear.get(),
            Thriver.calendar.thisMonth.get(), total),
        },
      }],
  }, { sort: { start: 1 } }).forEach((event) => {
    // If there's no start date, do nothing
    if (!(event.start instanceof Date)) return;

    let start = event.start.getDate();
    let thisTotal = 1;
    const thisEvent = event;

    // If there's an end date, calculate total number of days
    if (thisEvent.end instanceof Date) {
      thisTotal = (thisEvent.end.getDate() - start) + 1;

      // If total is negative, event spans multiple months
      if (thisTotal < 0) {
        // If the event ends this month
        if (thisEvent.end.getMonth() === Thriver.calendar.thisMonth.get()) {
          // Calculate total number of days for just this month
          thisTotal = thisEvent.end.getDate();
          start = 1;
        } else {
          // Otherwise, it starts this month
          thisTotal = (Thriver.calendar.lastDate() - thisEvent.start.getDate()) + 1;
        }
      }
    }

    // Add slide position
    thisEvent.position = count;
    count += 1;

    // For each day, add event info
    for (let i = 0; i < thisTotal; i += 1) {
      // If the date doesn't already exist, add it
      if (!currentEvents[start + i]) currentEvents[start + i] = [];

      // Add event details
      currentEvents[start + i].push(thisEvent);
    }
  });

  return currentEvents;
};

/**
 * @summary Slide to an event
 * @method
 *   @param {Number} position - Event position to slide to
 */
Thriver.events.slide = (position) => {
  check(position, Number);

  const slides = document.querySelector('.slides');

  // Close any open asides
  $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
  $('.listViewEvents').removeClass('active');
  $('.searchResultsList').removeClass('active');

  // Set current slide
  Thriver.events.currentSlide.set(position);

  // Smooth slide to it
  if (slides) slides.style.webkitTransform = `translate(-${position}00%, 0px)`;
};

// Events template events
Template.events.events({
  /**
   * Switch to previous month
   * @method
   *   @param {$.Event} event
   */
  'click .scroll-prev-month button, click .prevMonth': (event) => {
    check(event, $.Event);

    const lastMonth = Thriver.calendar.thisMonth.get() - 1;
    const parentName = document.querySelector('#main > .events').id;

    if (lastMonth < 0) Thriver.calendar.thisYear.set(Thriver.calendar.thisYear.get() - 1);

    Thriver.calendar.thisMonth.set(Thriver.calendar.getLastMonth());

    // Update Location Bar
    Thriver.history.update(parentName,
      `${parentName}/${Thriver.calendar.thisYear.get()}/${Thriver.calendar
        .months[Thriver.calendar.thisMonth.get()]}`);

    // Close any open asides
    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
    $('.searchResultsList').removeClass('active');
  },

  /**
   * Switch to next month
   * @method
   *   @param {$.Event} event
   */
  'click .scroll-next-month button, click .nextMonth': (event) => {
    check(event, $.Event);

    const nextMonth = Thriver.calendar.thisMonth.get() + 1;
    const parentName = document.querySelector('#main > .events').id;

    if (nextMonth > 11) Thriver.calendar.thisYear.set(Thriver.calendar.thisYear.get() + 1);

    Thriver.calendar.thisMonth.set(nextMonth % 12);

        // Update Location Bar
    Thriver.history.update(parentName,
      `${parentName}/${Thriver.calendar.thisYear.get()}/${Thriver.calendar
        .months[Thriver.calendar.thisMonth.get()]}`);

    // Close any open asides
    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
    $('.searchResultsList').removeClass('active');
  },

  /**
   * @summary Go to previous slide
   * @method
   *   @param {$.Event} event
   */
  'click .sliderPrev': (event) => {
    check(event, $.Event);

    const position = Thriver.events.currentSlide.get() - 1;

    // If the position would be less than zero, go to last month
    if (position < 0) {
      document.querySelector('.prevMonth').click();
      return;
    }

    Thriver.events.slide(position);
  },

  /**
   * @summary Go to next slide
   * @method
   *   @param {$.Event} event
   */
  'click .sliderNext': (event) => {
    check(event, $.Event);

    const position = Thriver.events.currentSlide.get() + 1;

    // If the position would be greater than the total, switch to next month
    if (position >= Thriver.events.slideTotal.get()) {
      document.querySelector('.nextMonth').click();
      return;
    }

    Thriver.events.slide(position);
  },

  /**
   * @summary Navigate to an event from the calendar
   * @method
   *   @param {$.Event} event
   */
  'click button.eventDate': (event) => {
    check(event, $.Event);

    Thriver.events.navigate(event.currentTarget.dataset.id);

    // Something to do with Mobile
    calMobileEvent();
  },

  /**
   * @summary Navigate to an event from Upcoming Events list
   * @method
   *   @param {$.Event} event
   */
  'click a.eventDate': (event) => {
    check(event, $.Event);
    event.preventDefault();

    Thriver.events.navigate(event.currentTarget.dataset.id);

    // Something to do with Mobile
    calMobileEvent();
  },

  /**
   * @summary When clicking the View All button
   * @method
   *   @param {$.Event} event
   */
  'click .listViewEvents': (event) => {
    check(event, $.Event);

    // Close
    if (event.target.classList.contains('active')) {
      document.querySelector('.listViewEventsObjectOpen').classList
        .remove('listViewEventsObjectOpen');
      event.target.classList.remove('active');
    // Open
    } else {
      const main = document.querySelector('.eventsMain');

      main.classList.add('listViewEventsObjectOpen');
      event.target.classList.add('active');

      // Click first tab for convenience
      main.querySelector('.tabs > li > a').click();
    }
  },

  //
  // TODO(eoghantadhg): Properly comment these
  //
  'click .unregister a': (event) => {
    check(event, $.Event);

    event.preventDefault();
    // Append template:actionUnregisterPrompt to top of ul.actions
  },
  'click span.truncated': (event) => {
    check(event, $.Event);
    $(event.currentTarget).parent().parent().parent()
      .parent()
      .addClass('extendedContent');
  },
  'click .eventSlide .actions .details': (event) => {
    check(event, $.Event);
    $(event.currentTarget).parent().parent().parent()
      .parent()
      .addClass('extendedContent');
  },
  'click .back-to-events': (event) => {
    check(event, $.Event);
    calMobileEvent();
  },
});

/** Event Slide Events */
Template.eventSlide.events({
  /**
   * @summary Register for Event
   * @method
   *   @param {$.Event} event
   */
  'click li.register': (event) => {
    check(event, $.Event);

    let a;
    let registrationForm;

    // If this is a third-party register link, navigate to it
    if (Blaze.getData().registerUrl) {
      // Create link
      a = document.createElement('a');
      a.href = Blaze.getData().registerUrl;
      a.target = '_blank';            // new tab
      a.classList.add('hide');        // keep hidden on page
      document.body.appendChild(a);   // Required for Mozilla to click

      a.click();
      a.remove();
    } else {
      // Find registration form
      registrationForm = event.target.parentElement
        .querySelector('.registration-form');

      // Show registration form if it has any fields
      if (registrationForm.querySelector('label')) {
        registrationForm.classList.remove('hide');

        // Remove Register button
        event.target.remove();

        return false;
      }

      // No registration form, so just register user
      Meteor.call('registerEvent', registrationForm.dataset.id);
    }

    return false;
  },

  /**
   * @summary Handle registration form submission
   * @method
   *   @param {$.Event} event
   */
  'click li.registrationForm': (event) => {
    check(event, $.Event);

    // TODO(micchickenburger): Complete event registration
  },

  /**
   * @summary Unregister for an event
   * @method
   *   @param {$.Event}
   */
  'click li.unregister': (event) => {
    check(event, $.Event);

    Meteor.call('unregisterEvent', Template.currentData()._id);
  },

  /**
   * @summary Navigate on click for Same-Day links
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    check(event, $.Event);

    // Do nothing else
    event.preventDefault();

    // Navigate
    Thriver.events.navigate(event.currentTarget.dataset.id);
  },
});
