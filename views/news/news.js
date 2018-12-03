import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import News from '/logic/news/schema';
import Toast from '/views/components/toasts';

import './news.html';
import './helpers';

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
   * @summary Add Library Form Submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#newsForm'(event) {
    event.preventDefault();

    const form = event.target;
    const type = form.newsType.value;

    if (!type) return;

    const data = {
      type,
      title: form.title.value,
      date: new Date(form.date.value),
      publisher: form.publisher ? form.publisher.value : undefined,
      description: form.description ? form.description.value : undefined,
      url: form.url ? form.url.value : undefined,
      content: form.content ? form.content.value : undefined,
    };

    // Insert subscriber into the collection
    Meteor.call('addNewsItem', data, function(error) {
      if (error) {
        console.error(error.reason);
      } else {
        document.getElementById('newsForm').reset();
        Toast({ text: 'News item added.', duration: 3000 });
      }
    });
  },

  /**
   * @summary Toggle Add Newsroom Item form
   * @method
   *   @param {$.Event} event
   */
  'click #news aside.admin button.add': () => {
    // Show form & hide tools
    const formContainer = document.querySelector('#admin-form-container-news-add');
    const adminTools = document.querySelector('#admin-tools-news');
    if (formContainer.classList.contains('hide')) {
      formContainer.classList.remove('hide');
      adminTools.classList.add('hide');
    } else {
      formContainer.classList.add('hide');
      adminTools.classList.remove('hide');
    }
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
