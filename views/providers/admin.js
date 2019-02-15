import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import Providers from '/logic/providers/schema';

import './admin.html';

Providers.formMethod = new ReactiveVar('addProvider');
const activeProvider = new ReactiveVar();

const phones = new ReactiveVar(new Map());
const emails = new ReactiveVar(new Map());

/**
 * @summary Close Provider Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
const closeForm = () => {
  // Close add Provider Form
  document.querySelector('.providers section.addProvider').classList.add('hide');

  // Show inner again
  document.querySelector('.providers .find-provider-inner').classList.remove('hide');
};

/** Admin events */
Template.addProviderForm.events({
  /**
   * @summary Close Form
   */
  'click button.close': closeForm,

  /**
   * @summary Add Provider Form Submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#admin-form-provider-add': (event) => {
    event.preventDefault();
    //closeForm();

    const getCounties = (checkboxesName) => {
      const checkboxes = document.getElementsByName(checkboxesName);
      const checkboxesChecked = [];
      for (let i = 0; i < checkboxes.length; i += 1) {
        if (checkboxes[i].checked) checkboxesChecked.push(checkboxes[i].value);
      }
      return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    };

    const getPhones = () => {
      const items = document.querySelectorAll('.provider-number-item');
      const arr = [];
      for (let i = 0; i < items.length; i += 1) {
        const obj = {
          number: items[i].querySelector('.number-inp').value,
          ext: Number(items[i].querySelector('.number-ext-inp').value),
          description: items[i].querySelector('.number-desc-inp').value,
          tty: items[i].querySelector('[name="provider-add-form-tty"]').checked,
        };
        arr.push(obj);
      }
      return arr;
    };

    const getEmails = () => {
      const items = document.querySelectorAll('.provider-email-item');
      const arr = [];
      for (let i = 0; i < items.length; i += 1) {
        const obj = {
          address: items[i].querySelector('.email-inp').value,
          description: items[i].querySelector('.email-desc-inp').value,
        };
        arr.push(obj);
      }
      return arr;
    };

    const form = document.getElementById('admin-form-provider-add');

    const data = {
      name: form.querySelector('input[name=name]').value,
      counties: getCounties('provider-add-form-county'),
      address: form.querySelector('textarea[name=address]').value,
      coordinates: {
        lat: Number(form.querySelector('input[name=latitude]').value),
        lon: Number(form.querySelector('input[name=longitude]').value),
      },
      phones: getPhones(), // array of objs
      crisis: {
        number: form.querySelector('input[name=crisis-number]').value,
        tty: form.querySelector('input[name=crisis-tty]').checked, // bool
        ext: Number(form.querySelector('input[name=crisis-ext]').value), // num
      },
      emails: getEmails(), // array of objs
      website: form.querySelector('input[name=website-url]').value,
      facebook: form.querySelector('input[name=facebook-url]').value,
      twitter: form.querySelector('input[name=twitter-url]').value,
      notes: form.querySelector('textarea[name=notes]').value,
      parent: form.querySelector('select[name=parent-location]').value,
    };

    // Insert subscriber into the collection
    Meteor.call('addProvider', data, function(error, results) {
      console.log(data);
      if (error) {
        console.error(error);
      } else {
        console.log(results);
      }
    });
  },

  /**
   * @summary Add a new phone number
   */
  'click #admin-btn-provider-add-number'(event) {
    event.preventDefault();

    // Create new item with random ID
    const id = Random.id();
    const map = phones.get();
    map.set(id, { id });

    // Trigger reactivity
    phones.set(phones.get());
  },

  /**
   * @summary Add a new email address
   */
  'click #admin-btn-provider-add-email'(event) {
    event.preventDefault();

    // Create new item with random ID
    const id = Random.id();
    const map = emails.get();
    map.set(id, { id });

    // Trigger reactivity
    emails.set(emails.get());
  },

  /**
   * @summary Remove phone number
   */
  'click .provider-phone-number-delete'(event) {
    event.preventDefault();

    const items = phones.get();
    const item = event.target.parentElement.parentElement;
    items.delete(item.dataset.id);

    // Trigger reactivity
    phones.set(items);
  },

  /**
   * @summary Remove email address
   */
  'click .provider-email-delete'(event) {
    event.preventDefault();

    const items = emails.get();
    const item = event.target.parentElement.parentElement;
    items.delete(item.dataset.id);

    // Trigger reactivity
    emails.set(items);
  },

});

Template.addProviderForm.helpers({
  counties: [
    'Adams', 'Ashland', 'Barron', 'Bayfield', 'Brown',
    'Buffalo', 'Burnett', 'Calumet', 'Chippewa', 'Clark',
    'Columbia', 'Crawford', 'Dane', 'Dodge', 'Door',
    'Douglas', 'Dunn', 'Eau Claire', 'Florence', 'Fond Du Lac',
    'Forest', 'Grant', 'Green', 'Green Lake', 'Iowa',
    'Iron', 'Jackson', 'Jefferson', 'Juneau', 'Kenosha',
    'Kewaunee', 'La Crosse', 'Lafayette', 'Langlade', 'Lincoln',
    'Manitowoc', 'Marathon', 'Marinette', 'Marquette', 'Menominee',
    'Milwaukee', 'Monroe', 'Oconto', 'Oneida', 'Outagamie',
    'Ozaukee', 'Pepin', 'Pierce', 'Polk', 'Portage',
    'Price', 'Racine', 'Richland', 'Rock', 'Rusk',
    'Saint Croix', 'Sauk', 'Sawyer', 'Shawano', 'Sheboygan',
    'Taylor', 'Trempealeau', 'Vernon', 'Vilas', 'Walworth',
    'Washburn', 'Washington', 'Waukesha', 'Waupaca', 'Waushara',
    'Winnebago', 'Wood',
  ],
});

/** Providers template events */
Template.providers.events({
  /**
   * @summary Show Provider Add Form
   * @method
   *   @param {$.Event} event
   */
  'click button.addProvider': (event) => {
    // Set appropriate form type
    Providers.formMethod.set('addProvider');
    activeProvider.set(null);

    const form = event.target.parentElement.parentElement.parentElement.parentElement
      .querySelector('section.addProvider');
    const contents = event.target.parentElement.parentElement.parentElement;

    if (form instanceof Element) form.classList.remove('hide');
    if (contents instanceof Element) contents.classList.add('hide');
  },
});

/** Admin Helpers */
Template.addProviderForm.helpers({
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
  providers: () => Providers.collection.find()
    .map(provider => ({ label: provider.name, value: provider._id })),

  phones: () => Array.from(phones.get().values()),
  emails: () => Array.from(emails.get().values()),

  checked: value => (value ? 'checked' : ''),
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
    if (window.confirm('Are you sure you want to delete this provider?')) {

      Meteor.call('deleteProvider', Providers.active.get()._id);

      // Close side pane and show whole map
      document.querySelector('.fullMap').click();

      // Unset current provider
      Providers.active.set(null);
    }
  },
});
