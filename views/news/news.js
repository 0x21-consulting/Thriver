import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import News from '/logic/news/schema';

import './news.html';
import './helpers.js';

// How many list items to load
News.quantity = new ReactiveVar(5);

// Regular Expression for Search field
News.search = new ReactiveVar();

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
const handleSearch = (event) => {
  const { value } = event.target;

  // If field is empty, clear reactive search variable
  if (value.length === 0) News.search.set();

  // Otherwise, create RegExp for searching fields
  else News.search.set(new RegExp(`.*${value}.*`, 'gi'));
};

// Subscriptions
Meteor.subscribe('inTheNews');
Meteor.subscribe('pressReleases');
Meteor.subscribe('actionAlerts');
Meteor.subscribe('newsletters');

// Events
Template.aside.events({
  /**
   * @summary Load More
   * @method
   *   @param {$.Event} event
   */
  'click #news li.loadMore button': () => {
    // Get all results
    News.quantity.set(0);

    // Hide "Load More Results" button for entire section
    const buttons = document.querySelectorAll('#news li.loadMore button');
    for (let i = 0; i < buttons.length; i += 1) buttons[i].classList.add('hide');

    // Show "everything" text
    const texts = document.querySelectorAll('#news .everything');
    for (let i = 0; i < texts.length; i += 1) texts[i].classList.remove('hide');
  },

  // Search field
  'keyup #searchNews, search #searchNews': handleSearch,

  /**
   * @summary Prevent form submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#searchNewsForm': event => event.preventDefault(),

  /**
   * @summary Toggle Add Newsroom Item form
   * @method
   *   @param {$.Event} event
   */
  'click #news aside.admin button.add': () => {
    // Show form
    const form = document.querySelector('#newsForm');
    if (form.classList.contains('hide')) form.classList.remove('hide');
    else form.classList.add('hide');
  },
});

// Administrative events
Template.list.events({
  /**
   * @summary Delete a newsroom item
   * @method
   *   @param {$.Event} event
   */
  'click [data-tag="news"] aside.admin button.delete': (event) => {
    event.stopPropagation();

    const { id } = event.target.parentElement.parentElement.dataset;
    if (window.confirm('Are you sure you want to delete this News Item?')) {
      Meteor.call('deleteNewsItem', id);
    }
  },
});

Template.newsSubHead.helpers({
  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  news: () => News.collection,
});
