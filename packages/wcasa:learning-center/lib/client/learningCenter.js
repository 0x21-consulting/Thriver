// How many list items to load
Thriver.learningCenter.quantity = new ReactiveVar(5);

// Regular Expression for Search field
Thriver.learningCenter.search = new ReactiveVar();

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
const handleSearch = (event) => {
  const value = event.target.value;

  // If field is empty, clear reactive search variable
  if (value.length === 0) Thriver.learningCenter.search.set();

  // Otherwise, create RegExp for searching fields
  else Thriver.learningCenter.search.set(new RegExp(`.*${value}.*`, 'gi'));
};

// Subscriptions
Meteor.subscribe('infosheets');
Meteor.subscribe('webinars');

// Events
Template.aside.events({
  /**
   * @summary Load More
   * @method
   *   @param {$.Event} event
   */
  'click #learning-center li.loadMore button': (event) => {
    check(event, $.Event);
    check(event.target, Element);

    // Get all results
    Thriver.learningCenter.quantity.set(0);

    // Hide "Load More Results" button
    event.target.classList.add('hide');
  },

  // Search field
  'keyup #searchLC, search #searchLC': handleSearch,

  /**
   * @summary Prevent form submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#searchLCForm': (event) => {
    check(event, $.Event);

    // Prevent form submission
    event.preventDefault();
  },

  /**
   * @summary Toggle Add Learning Center Item form
   * @method
   *   @param {$.Event} event
   */
  'click #learning-center aside.admin button.add': (event) => {
    check(event, $.Event);

    // Show form
    const form = document.querySelector('#LCForm');
    if (form.classList.contains('hide')) form.classList.remove('hide');
    else form.classList.add('hide');
  },
});

// Administrative events
Template.list.events({
  /**
   * @summary Delete a Learning Center item
   * @method
   *   @param {$.Event} event
   */
  'click [data-tag="lc"] aside.admin button.delete': (event) => {
    check(event, $.Event);

    event.stopPropagation();

    const id = event.target.parentElement.parentElement.dataset.id;
    if (confirm('Are you sure you want to delete this Learning Center Item?')) {
      Meteor.call('deleteLearningCenterItem', id);
    }
  },
});
