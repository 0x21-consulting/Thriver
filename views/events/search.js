import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Events from '/logic/events/schema';

/**
 * @summary Close Search template
 * @method
 *   @param {$.Event} event
 */
const closeSearch = () => {
  // Close search
  document.querySelector('.searchResultsList').classList.remove('active');

  return false;
};

/**
 * @summary Search query
 * @type {ReactiveVar}
 */
const query = new ReactiveVar('');

/** Events for Events Template */
Template.events.events({
  /**
   * @summary Open search results template
   * @method
   *   @param {$.Event} event
   */
  'keyup #eventSearch': (event) => {
    // If there's no query, close search
    if (!event.target.value.trim()) {
      closeSearch(event);
      return false;
    }

    // Otherwise open search
    query.set(event.target.value);
    document.querySelector('.searchResultsList').classList.add('active');

    return false;
  },

  /**
   * @summary Close search on clear
   */
  'search #eventSearch': closeSearch,
});

/** Search Results */
Template.searchResultsList.helpers({
  /**
   * @summary Show search results
   * @function
   */
  results: () => Events.collection.find({
    // Just search for titles for now
    name: new RegExp(query.get(), 'i'),
  }, { limit: 5, sort: { start: -1 } }),

  /**
   * @summary Determine whether event was in the past
   * @function
   *   @param {Date} start
   * @returns {Boolean}
   */
  past: (start) => {
    if (start < new Date()) return 'past';

    return '';
  },

  /**
   * @summary Determine whether event occurred last year
   * @function
   *   @param {Date} start
   * @returns {Boolean}
   */
  pastYear: (start) => {
    if (start.getFullYear() !== (new Date()).getFullYear()) return true;

    return false;
  },

  /**
   * @summary Return year if pastYear is true
   * @function
   *   @param {Date} start
   * @returns {number}
   */
  year: start => start.getFullYear(),
});

/** Results events */
Template.searchResultsList.events({
  /**
   * @summary Navigate to an event
   * @method
   *   @param {$.Event} event
   */
  'click a': (event) => {
    // Do nothing else
    event.preventDefault();

    // Navigate
    Events.navigate(event.currentTarget.dataset.id);
  },
});
