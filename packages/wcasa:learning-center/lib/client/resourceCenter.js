// How many list items to load
Thriver.resourceCenter.quantity = new ReactiveVar(5);

// Regular Expression for Search field
Thriver.resourceCenter.search = new ReactiveVar();

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
const handleSearch = (event) => {
  const { value } = event.target;

  // If field is empty, clear reactive search variable
  if (value.length === 0) Thriver.resourceCenter.search.set();

  // Otherwise, create RegExp for searching fields
  else Thriver.resourceCenter.search.set(new RegExp(`.*${value}.*`, 'gi'));
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
  'click #resource-center li.loadMore button': (event) => {
    check(event, $.Event);
    // No check on event.target because of old browser compatibility

    // Get all results
    Thriver.resourceCenter.quantity.set(0);

    // Hide "Load More Results" button for entire section
    const buttons = document.querySelectorAll('#resource-center li.loadMore button');
    for (let i = 0; i < buttons.length; i += 1) buttons[i].classList.add('hide');

    // Show "everything" text
    const texts = document.querySelectorAll('#resource-center .everything');
    for (let i = 0; i < texts.length; i += 1) texts[i].classList.remove('hide');
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
   * @summary Toggle Add Resource Center Item form
   * @method
   *   @param {$.Event} event
   */
  'click #resource-center aside.admin button.add': (event) => {
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
   * @summary Delete a Resource Center item
   * @method
   *   @param {$.Event} event
   */
  'click [data-tag="lc"] aside.admin button.delete': (event) => {
    check(event, $.Event);

    event.stopPropagation();

    const { id } = event.target.parentElement.parentElement.dataset;
    if (window.confirm('Are you sure you want to delete this Resource Center Item?')) {
      Meteor.call('deleteResourceCenterItem', id);
    }
  },
});