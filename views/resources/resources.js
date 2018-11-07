import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Resources from '/logic/resources/schema';

import './resources.html';
import './helpers';

// How many list items to load
Resources.quantity = new ReactiveVar(5);

// Regular Expression for Search field
Resources.search = new ReactiveVar();

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
const handleSearch = (event) => {
  const { value } = event.target;

  // If field is empty, clear reactive search variable
  if (value.length === 0) Resources.search.set();

  // Otherwise, create RegExp for searching fields
  else Resources.search.set(new RegExp(`.*${value}.*`, 'gi'));
};

// Subscriptions
Meteor.subscribe('infosheets');
Meteor.subscribe('webinars');
Meteor.subscribe('library');

/**
 * @summary Convert a string to lowercase and without special characters or spaces
 */
Template.registerHelper('simpleString', (string) => {
  return string.toLowerCase().replace(/\s/g, '');
});

// Events
Template.aside.events({
  /**
   * @summary Load More
   * @method
   *   @param {$.Event} event
   */
  'click #resource-center li.loadMore button': () => {
    // No check on event.target because of old browser compatibility

    // Get all results
    Resources.quantity.set(0);

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
   * @summary Prevent resources form submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#searchLCForm': event => event.preventDefault(),

  /**
   * @summary Add Library Form Submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#admin-form-library-add': (event) => {

    event.preventDefault();

    const getTags = (checkboxesName) => {
      const checkboxes = document.getElementsByName(checkboxesName);
      const checkboxesChecked = [];
      for (let i = 0; i < checkboxes.length; i += 1) {
        if (checkboxes[i].checked) checkboxesChecked.push(checkboxes[i].value);
      }
      return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    };

    const data = {
      title: document.getElementById('library-add-form-title').value,
      description: document.getElementById('library-add-form-desc').value,
      callNumber: document.getElementById('library-add-form-callNumber').value,
      copies: document.getElementById('library-add-form-copies').value,
      subjectHeading: document.getElementById('library-add-form-subjectHeading').value,
      classification: document.getElementById('library-add-form-classifications').value,
      material: document.getElementById('library-add-form-material').value,
      status: document.getElementById('library-add-form-status').value,
      tags: getTags('library-add-form-keywords'),
    };

    console.log(data);

    // Insert subscriber into the collection
    Meteor.call('addLibraryItem', data, function(error) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log('Subscription successful');
        console.log(data);
      }
    });
  },

  /**
   * @summary Toggle Add Resource Center Item form
   * @method
   *   @param {$.Event} event
   */
  'click #admin-btn-resource-add': () => {
    // Show form
    const form = document.querySelector('#LCForm');
    if (form.classList.contains('hide')) form.classList.remove('hide');
    else form.classList.add('hide');
  },

  /**
   * @summary Toggle Add Library Item form
   * @method
   *   @param {$.Event} event
   */
  'click #admin-btn-library-add': () => {
    // Show form
    const formContainer = document.querySelector('#admin-form-container-library-add');
    if (formContainer.classList.contains('hide')) formContainer.classList.remove('hide');
    else formContainer.classList.add('hide');
  },

  /**
   * @summary Add aria-expanded to Summary/Details element
   * @method
   *   @param {$.Event} event
   */
  'click #resource-center summary': (event) => {
    const item = event.target.closest('details');
    if (item.getAttribute('aria-expanded') === 'false') item.setAttribute('aria-expanded', 'true');
    else item.setAttribute('aria-expanded', 'false');
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
    event.stopPropagation();

    const { id } = event.target.parentElement.parentElement.dataset;
    if (window.confirm('Are you sure you want to delete this Resource Center Item?')) {
      Meteor.call('deleteResourceCenterItem', id);
    }
  },
});

Template.lcSubHead.helpers({
  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  resources: () => Resources.collection,
});

Template.libraryAddForm.helpers({
  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  library: () => Resources.collection,
});
