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

  // const slides = document.querySelector('.slides');

  // Close any open asides
  $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
  $('.listViewEvents').removeClass('active');
  $('.searchResultsList').removeClass('active');

  // Set current slide
  // Thriver.events.currentSlide.set(position);

  // Smooth slide to it
  // if (slides) slides.style.webkitTransform = `translate(-${position}00%, 0px)`;
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
   * @summary Go to the next or previous slide
   * @method
   *   @param {$.Event} event
   */
  'click .eventsSlider button': (event) => {
    check(event, $.Event);

    const parent = event.target.parentElement;
    const prev = parent.querySelector('li.prev');
    const current = parent.querySelector('li.current');
    const next = parent.querySelector('li.next');

    let month = Thriver.calendar.thisMonth.get();
    let year = Thriver.calendar.thisYear.get();

    // Remove classes
    prev.classList.remove('prev');
    current.classList.remove('current');
    next.classList.remove('next');

    // Previous slide
    if (event.target.classList.contains('prev')) {
      // Slide first
      current.classList.add('next');
      prev.classList.add('current');
      if ($(prev).prev()) $(prev).prev().addClass('prev');

      // Keep track of current element after month change
      Thriver.calendar.currentSlide.set(prev.dataset.id);

      // Need to change month?
      if (prev.classList.contains('lastMonth')) {
        if (month - 1 < 0) {
          month = 12;
          year -= 1;
        }

        Thriver.calendar.thisMonth.set(month - 1);
        Thriver.calendar.thisYear.set(year);
      }
    }

    // Next slide
    if (event.target.classList.contains('next')) {
      // Slide first
      current.classList.add('prev');
      next.classList.add('current');
      if ($(next).next()) $(next).next().addClass('next');

      // Keep track of current element after month change
      Thriver.calendar.currentSlide.set(next.dataset.id);

      // Need to change month?
      if (next.classList.contains('nextMonth')) {
        if (month + 1 > 11) {
          month = -1;
          year += 1;
        }

        Thriver.calendar.thisMonth.set(month + 1);
        Thriver.calendar.thisYear.set(year);
      }
    }
  },

  /**
   * @summary Navigate to an event from the calendar
   * @method
   *   @param {$.Event} event
   */
  'click button.eventDate, click a.eventLink': (event) => {
    check(event, $.Event);
    event.preventDefault();

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
   * @summary When clicking the Today button
   * @method
   *   @param {$.Event} event
   */
  'click .viewThisMonth': (event) => {
    check(event, $.Event);

    const date = new Date();

    // Switch to this month
    Thriver.calendar.thisMonth.set(date.getMonth());
    Thriver.calendar.thisYear.set(date.getFullYear());
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
  // TODO(eoghantadhg): Create a more universal function for showing/hiding events list
  // Shows upcoming / past events via the calendar sidebar
  //
  'click .listViewEvents-proxy': (event) => {
    check(event, $.Event);
    $('.events .listViewEvents').click();
  },
  'click .listViewEventsPast-proxy': (event) => {
    check(event, $.Event);
    $('.events .listViewEvents').click();
    $('.events a[data-id="pastEventsList"]').click();
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
        event.target.classList.add('hide');

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
  'submit li.registration-form form': (event) => {
    check(event, $.Event);
    event.preventDefault();

    const form = event.target;
    const attributes = {};

    for (let i = 0; i < form.length - 1; i += 1) attributes[form[i].name] = form[i].value;

    Meteor.call('registerEvent', form.parentElement.dataset.id, attributes);

    // Hide registration form
    form.parentElement.classList.add('hide');

    // Show register button again
    form.parentElement.parentElement.querySelector('li.action').classList.remove('hide');
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
