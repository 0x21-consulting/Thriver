import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Providers from '/logic/providers/schema';

import './admin.html';

Providers.formMethod = new ReactiveVar('addProvider');
const activeProvider = new ReactiveVar();

/**
 * @summary Close Provider Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
const closeForm = (event) => {
  // Close add Provider Form
  event.delegateTarget.querySelector('section.addProvider').classList.add('hide');

  // Show inner again
  event.delegateTarget.querySelector('.mapTool').classList.remove('hide');
};

/** Admin events */
Template.addProvider.events({
  /**
   * @summary Close Form
   */
  'click button.close': closeForm,
  'submit #providerForm': closeForm,
});

/** Providers template events */
Template.providers.events({
  /**
   * @summary Show Provider Add Form
   * @method
   *   @param {$.Event} event
   */
  'click button.addProvider': (event) => {
    event.preventDefault();

    // Set appropriate form type
    Providers.formMethod.set('addProvider');
    activeProvider.set(null);

    const popout = event.target.parentElement.parentElement.parentElement;
    const form = event.target.parentElement.parentElement.parentElement
      .querySelector('section.addProvider');
    const mapTool = event.target.parentElement.parentElement.parentElement
      .querySelector('.mapTool');

    if (popout instanceof Element) popout.classList.remove('full-view');
    if (form instanceof Element) form.classList.remove('hide');
    if (mapTool instanceof Element) mapTool.classList.add('hide');
  },
});

/** Admin Helpers */
Template.addProvider.helpers({
  /**
   * @summary Meteor Method to call on submit
   * @function
   * @returns {String}
   */
  method: () => Providers.formMethod.get(),

  /**
   * @summary Document context for updates
   * @function
   * @returns {Object}
   */
  doc: () => activeProvider.get(),

  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  providers: () => Providers.collection,
});

/** Admin events for provider popout */
Template.provider.events({
  /**
   * @summary Edit Provider
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .edit': (event) => {
    // Set form type to Update
    Providers.formMethod.set('updateProvider');
    activeProvider.set(Providers.active.get());

    // Hide Slider and show admin interface
    const popout = event.delegateTarget.parentElement;
    const form = event.delegateTarget.querySelector('section.addProvider');
    const inner = event.delegateTarget.querySelector('.inner');

    if (popout instanceof Element) popout.classList.remove('full-view');
    if (form instanceof Element) form.classList.remove('hide');
    if (inner instanceof Element) inner.classList.add('hide');
  },

  /**
   * @summary Delete Provider
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .delete': () => {
    if (window.confirm('Are you sure you want to delete this provicer?')) {
      Meteor.call('deleteProvider', Providers.active.get()._id);

      // Close side pane and show whole map
      document.querySelector('.mapView').click();

      // Unset current provider
      Providers.current.set(null);
    }
  },
});
