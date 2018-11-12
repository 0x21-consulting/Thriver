import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import Events from '/logic/events/schema';
import Calendar from './calendar';
import History from '/views/history/history';

import './events.html';
import './admin';
import './helpers';
import './history';
import './search';
import './viewAll';

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
Events.sameDayEvents = [];

/**
 * Get all events that start or end in the active month
 * @function
 * @returns {Object}
 */
Events.getThisMonthEvents = () => {
  const currentEvents = {};
  const total = Calendar.lastDate();
  let count = 0;

  // Get all events and organize them in an easily-accessible way
  Events.collection.find({
    $or: [{
      start: {
        $gte: new Date(
          Calendar.thisYear.get(),
          Calendar.thisMonth.get(),
        ),
        $lte: new Date(
          Calendar.thisYear.get(),
          Calendar.thisMonth.get(),
          total,
        ),
      },
    }, {
      end: {
        $gte: new Date(
          Calendar.thisYear.get(),
          Calendar.thisMonth.get(),
        ),
        $lte: new Date(
          Calendar.thisYear.get(),
          Calendar.thisMonth.get(),
          total,
        ),
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
        if (thisEvent.end.getMonth() === Calendar.thisMonth.get()) {
          // Calculate total number of days for just this month
          thisTotal = thisEvent.end.getDate();
          start = 1;
        } else {
          // Otherwise, it starts this month
          thisTotal = (Calendar.lastDate() - thisEvent.start.getDate()) + 1;
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

// Events template events
Template.events.events({
  /**
   * Switch to previous month
   * @method
   *   @param {$.Event} event
   */
  'click .scroll-prev-month button, click .prevMonth': () => {
    const lastMonth = Calendar.thisMonth.get() - 1;
    const parentName = document.querySelector('#main > .events').id;

    if (lastMonth < 0) Calendar.thisYear.set(Calendar.thisYear.get() - 1);

    Calendar.thisMonth.set(Calendar.getLastMonth());

    // Update Location Bar
    History.update(
      parentName,
      `${parentName}/${Calendar.thisYear.get()}/${Calendar
        .months[Calendar.thisMonth.get()]}`,
    );

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
  'click .scroll-next-month button, click .nextMonth': () => {
    const nextMonth = Calendar.thisMonth.get() + 1;
    const parentName = document.querySelector('#main > .events').id;

    if (nextMonth > 11) Calendar.thisYear.set(Calendar.thisYear.get() + 1);

    Calendar.thisMonth.set(nextMonth % 12);

    // Update Location Bar
    History.update(
      parentName,
      `${parentName}/${Calendar.thisYear.get()}/${Calendar
        .months[Calendar.thisMonth.get()]}`,
    );

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
    const parent = event.target.parentElement;
    const prev = parent.querySelector('li.prev');
    const current = parent.querySelector('li.current');
    const next = parent.querySelector('li.next');

    let month = Calendar.thisMonth.get();
    let year = Calendar.thisYear.get();

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
      Calendar.currentSlide.set(prev.dataset.id);

      // Need to change month?
      if (prev.classList.contains('lastMonth')) {
        if (month - 1 < 0) {
          month = 12;
          year -= 1;
        }

        Calendar.thisMonth.set(month - 1);
        Calendar.thisYear.set(year);
      }
    }

    // Next slide
    if (event.target.classList.contains('next')) {
      // Slide first
      current.classList.add('prev');
      next.classList.add('current');
      if ($(next).next()) $(next).next().addClass('next');

      // Keep track of current element after month change
      Calendar.currentSlide.set(next.dataset.id);

      // Need to change month?
      if (next.classList.contains('nextMonth')) {
        if (month + 1 > 11) {
          month = -1;
          year += 1;
        }

        Calendar.thisMonth.set(month + 1);
        Calendar.thisYear.set(year);
      }
    }
  },

  /**
   * @summary Navigate to an event from the calendar
   * @method
   *   @param {$.Event} event
   */
  'click button.eventDate, click a.eventLink': (event) => {
    event.preventDefault();

    Events.navigate(event.currentTarget.dataset.id);

    // Something to do with Mobile
    calMobileEvent();
  },

  /**
   * @summary Navigate to an event from Upcoming Events list
   * @method
   *   @param {$.Event} event
   */
  'click a.eventDate': (event) => {
    event.preventDefault();

    Events.navigate(event.currentTarget.dataset.id);

    // Something to do with Mobile
    calMobileEvent();
  },

  /**
   * @summary When clicking the Today button
   * @method
   *   @param {$.Event} event
   */
  'click .viewThisMonth': () => {
    const date = new Date();

    // Switch to this month
    Calendar.thisMonth.set(date.getMonth());
    Calendar.thisYear.set(date.getFullYear());

    // Close any open asides
    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
    $('.searchResultsList').removeClass('active');
  },

  /**
   * @summary When clicking the View All button
   * @method
   *   @param {$.Event} event
   */
  'click .listViewEvents': (event) => {
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
  'click .listViewEvents-proxy': () => $('.events .listViewEvents').click(),

  'click .listViewEventsPast-proxy': () => {
    $('.events .listViewEvents').click();
    $('.events a[data-id="pastEventsList"]').click();
  },

  //
  // TODO(eoghantadhg): Properly comment these
  //
  'click .unregister a': (event) => {
    event.preventDefault();
    // Append template:actionUnregisterPrompt to top of ul.actions
  },
  'click span.truncated': (event) => {
    $(event.currentTarget).parent().parent().parent()
      .parent()
      .addClass('extendedContent');
  },
  'click .eventSlide .actions .details': (event) => {
    $(event.currentTarget).parent().parent().parent()
      .parent()
      .addClass('extendedContent');
  },
  'click .back-to-events': () => calMobileEvent(),
});

/** Event Slide Events */
Template.eventSlide.events({
  /**
   * @summary Register for Event
   * @method
   *   @param {$.Event} event
   */
  'click li.register': (event) => {
    let a;
    let registrationForm;

    // If this is a third-party register link, navigate to it
    if (Template.instance().data.registerUrl) {
      // Create link
      a = document.createElement('a');
      a.href = Template.instance().data.registerUrl;
      a.target = '_blank';
      a.classList.add('hide');
      document.body.appendChild(a); // Required for Mozilla to click

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
  'click li.unregister': () => Meteor.call('unregisterEvent', Template.currentData()._id),

  /**
   * @summary Navigate on click for Same-Day links
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

export default Events;
