import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import Events from '/logic/events/schema';
import Calendar from './calendar';
import History from '/views/history/history';
import Sections from '/logic/sections/sections';

/**
 * @summary Register Deep-linking
 * @method
 */
Template.events.onRendered(() => {
  // Get db ID from current instance
  const instanceName = Template.instance().data.name;

  // Register
  if (instanceName) {
    History.registry.insert({
      element: Sections.generateId(instanceName),
      /** Handle deep-linking */
      callback: path => Events.parsePath(path),
    });
  }
});

/**
 * @summary Navigate to an event
 * @method
 *   @param {String} id - The ID of an event to navigate to
 */
Events.navigate = (id) => {
  const thisEvent = Events.collection.findOne({ _id: id });

  // Set Month and year based on event Start date
  Calendar.currentSlide.set(id);
  Calendar.thisYear.set(thisEvent.start.getFullYear());
  Calendar.thisMonth.set(thisEvent.start.getMonth());

  // Close any open asides
  $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
  $('.listViewEvents').removeClass('active');
  $('.searchResultsList').removeClass('active');

  // Determine URI path
  const events = document.querySelector('#main > .events');
  const parentName = events.id;
  const path = `${parentName}/${Calendar.thisYear.get()}/${Calendar
    .months[Calendar.thisMonth.get()]}/${Sections.generateId(thisEvent.name)}/`;

  // Update URI using History API
  History.update(parentName, path);

  // Smooth scroll
  const offset = events.offsetTop + 350;

  if ('scrollBehavior' in document.documentElement.style) {
    window.scroll({ top: offset, behavior: 'smooth' });
  } else {
    $('body,html').stop(true, true).animate({ scrollTop: offset }, 750);
  }
};

/**
 * @summary Parse URL path for event data
 * @method
 *   @param {String[]} path - The path by which to navigate
 */
Events.parsePath = (path) => {
  /**
   * @summary Return whether a string is a valid month
   * @function
   *   @param {String} month
   *   @param {Number} index
   */
  const isMonth = i => (month, index) => {
    if (month.toLowerCase() === path[i].toLowerCase()) {
      Calendar.thisMonth.set(index);
      return true;
    }
    return false;
  };

  for (let i = 0; i < path.length; i += 1) {
    // Year
    if (path[i].match(/^\d{4}$/)) {
      Calendar.thisYear.set(Number(path[i]));
    }
    // Specific event ID
    if (path[i].match(/^[a-z0-9]{17}$/i)) {
      Events.navigate(path[i]);
    }

    // Check for month
    Calendar.months.forEach(isMonth(i));

    // TODO(micchickenburger): Check for event title
  }
};
