/**
 * @summary Close Search template
 * @method
 *   @param {$.Event} event
 */
const closeSearch = (event) => {
  check(event, $.Event);

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
    check(event, $.Event);

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
  results: () =>
    // Get search query
    Thriver.events.collection.find({
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
    check(start, Date);

    if (start < new Date()) return 'past';

    return '';
  },
});

/** Results events */
Template.searchResultsList.events({
  /**
   * @summary Navigate to an event
   * @method
   *   @param {$.Event} event
   */
  'click a': (event) => {
    check(event, $.Event);

    // Do nothing else
    event.preventDefault();

    // Navigate
    Thriver.events.navigate(event.currentTarget.dataset.id);
  },
});
