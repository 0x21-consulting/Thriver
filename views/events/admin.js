import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import Events from '/logic/events/schema';

import './admin.html';

const formMethod = new ReactiveVar('addEvent');
const activeEvent = new ReactiveVar();
const isAllDayEvent = new ReactiveVar(false);
const registrationItems = new ReactiveVar([]);
const pricingItems = new ReactiveVar([]);
const Registrations = new Mongo.Collection('registrations');

/**
 * @summary Close Event Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
const closeForm = (event) => {
  // Close add Event Form
  const slider = event.delegateTarget.querySelector('.eventsSlider');
  if (slider instanceof Element) slider.classList.remove('hide');
  const addEvent = event.delegateTarget.querySelector('section.addEvent');
  if (addEvent instanceof Element) addEvent.classList.add('hide');
  const viewRegs = event.delegateTarget.querySelector('section.viewRegistrations');
  if (viewRegs instanceof Element) viewRegs.classList.add('hide');
};

/** Admin events */
Template.eventsAdmin.events({
  /**
   * @summary Close Form
   */
  'click button.close': closeForm,
  'submit #eventForm': closeForm,
});

Template.eventAddForm.helpers({
  showTimes: () => !isAllDayEvent.get(),
  formType: () => (formMethod.get() === 'updateEvent' ? 'Update' : 'Add'),

  /**
   * @summary Document context for updates
   * @function
   * @returns {Object}
   */
  doc: () => activeEvent.get(),

  /**
   * @summary Checked attribute given some condition
   * @param {boolean} bool
   * @returns {string}
   */
  checked: bool => (bool ? 'checked' : ''),
  selected: (a, b) => (a === b ? 'selected' : ''),

  /**
   * @summary Get pricing items
   */
  pricingItems: () => pricingItems.get(),

  /**
   * @summary Get registration items
   */
  registrationItems: () => registrationItems.get(),

  /**
   * @summary Return time in expected format
   */
  time: time => (time ? time.toTimeString().replace(/^((.+:).+):.+/, '$1') : ''),

  /**
   * @summary Return date in expected format
   */
  date: date => (date ? date.toISOString().replace(/^(.+)T.+/, '$1') : ''),
});

/** Admin events */
Template.eventAddForm.events({
  'change #event-add-form-multi-day'(event) {
    const { checked } = event.target;

    if (checked) isAllDayEvent.set(true);
    else isAllDayEvent.set(false);
  },

  /**
   * @summary Add a new pricing tier
   */
  'click #admin-btn-event-add-pricing-tier'(event) {
    event.preventDefault();
    const items = pricingItems.get();
    items.push({});
    pricingItems.set(items);
  },

  /**
   * @summary Add a new registration item
   */
  'click #admin-btn-event-add-registration-item'(event) {
    event.preventDefault();
    const items = registrationItems.get();
    items.push({});
    registrationItems.set(items);
  },

  /**
   * @summary Close Form
   */
  'click button.close': closeForm,

  /**
   * @summary Add Event Submission
   * @method
   *   @param {$.Event} event
   */
  'submit form#admin-form-event-add': (event) => {
    event.preventDefault();

    const form = event.target;

    // Return PriceTiersArray
    const priceTiersArray = () => {
      const tiers = document.querySelectorAll('.event-price-tier');
      const arr = [];
      for (let i = 0; i < tiers.length; i += 1) {
        const obj = {
          description: tiers[i].querySelector('.description-inp').value,
          cost: tiers[i].querySelector('.cost-inp').value,
        };
        arr.push(obj);
      }
      return arr;
    };

    // Return RegistrationArray
    const registrationDetailsArray = () => {
      const items = document.querySelectorAll('.event-registration-item');
      const arr = [];
      for (let i = 0; i < items.length; i += 1) {
        const obj = {
          name: items[i].querySelector('.field-name-inp').value,
          type: items[i].querySelector('.field-type-inp').value,
        };
        arr.push(obj);
      }
      return arr;
    };

    const startDate = form.dateStart.value;
    const startTime = form.timeStart ? form.timeStart.value : '';
    const endDate = form.dateEnd.value;
    const endTime = form.timeEnd ? form.timeEnd.value : '';
    const start = new Date(`${startDate} ${startTime}`);
    let end;

    if (endDate) {
      if (endTime) end = new Date(`${endDate} ${endTime}`);
      end = new Date(endDate);
    }

    const data = {
      name: form.name.value,
      description: form.description.value,
      awareness: form.awareness.value,
      start: start ? start.getTime() : undefined,
      end: end ? end.getTime() : undefined,
      location: {
        name: form.locationName.value,
        mapUrl: form.mapUrl.value,
        webinarUrl: form.webinarUrl.value,
      },
      cost: priceTiersArray(),
    };

    const required = form.registrationRequired.checked;
    if (required) {
      data.registration = {
        required,
        registerUrl: form.registrationUrl.value,
        registrationDetails: registrationDetailsArray(),
      };
    }

    if (formMethod.get() === 'updateEvent') {
      // Add event ID
      data._id = activeEvent.get()._id;
      Meteor.call('updateEvent', data, (error) => {
        if (error) console.error(error);
        else document.querySelector('#admin-form-container-event-add button.close').click();
      });
    } else {
      // Insert event into the collection
      Meteor.call('addEvent', data, (error) => {
        if (error) console.error(error);
        else form.reset();
      });
    }
  },
});

/** Events template events */
Template.upcomingEvents.events({
  /**
   * @summary Show Event Add Form
   * @method
   */
  'click li.addEvent': () => {
    // Set appropriate form type
    formMethod.set('addEvent');
    activeEvent.set(null);

    pricingItems.set([]);
    registrationItems.set([]);

    const slider = document.getElementById('events-slider');
    const admin = document.getElementById('admin-form-container-context-event-add');

    if (slider instanceof Element) slider.classList.add('hide');
    if (admin instanceof Element) admin.classList.remove('hide');

    $('.listViewEventsObjectOpen').removeClass('listViewEventsObjectOpen');
    $('.listViewEvents').removeClass('active');
  },
});

/** Admin Helpers */
Template.eventsAdmin.helpers({
  /**
   * @summary Meteor Method to call on submit
   * @function
   * @returns {String}
   */
  method: () => formMethod.get(),

  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  events: () => Events.collection,
});

/** Admin events for event sliders */
Template.eventSlide.events({
  /**
   * @summary Edit Event
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .edit': (event) => {
    // Set form type to Update
    formMethod.set('updateEvent');
    const { data } = Template.instance();
    activeEvent.set(data);

    pricingItems.set(data.cost);
    registrationItems.set(data.registration.registrationDetails);

    // Hide Slider and show admin interface
    const eventsSlider = event.delegateTarget.parentElement.parentElement;

    eventsSlider.classList.add('hide');
    eventsSlider.parentElement.querySelector('section.addEvent')
      .classList.remove('hide');
  },

  /**
   * @summary Delete Event
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .delete': () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      Meteor.call('deleteEvent', Template.instance().data._id);
    }
  },

  /**
   * @summary View Registrations
   * @method
   *   @param {$.Event} event
   */
  'click li.viewRegistrations': (event) => {
    // Hide slider and show Registrations
    const eventsSlider = event.delegateTarget.parentElement.parentElement;

    eventsSlider.classList.add('hide');
    eventsSlider.parentElement.querySelector('section.viewRegistrations')
      .classList.remove('hide');

    // Set active event
    activeEvent.set(Template.instance().data);
  },
});

/** Event Registration Admin Helpers */
Template.viewRegistrations.helpers({
  /**
   * @summary Registrant details
   * @function
   * @returns {[Meteor.Profile]}
   */
  registrant: () => {
    if (activeEvent.get()) {
      Meteor.subscribe('registrations', activeEvent.get()._id);

      return Registrations.find({});
    }
    return [];
  },

  /**
   * @summary Return first email address from user profile
   * @function
   *   @param {[Object]} emails
   * @returns {String}
   */
  getEmail: emails => emails[0].address,

  /**
   * @summary Return special event fields
   * @function
   * @returns {[String]}
   */
  getSpecialFields: () => {
    if (activeEvent.get()) return activeEvent.get().registration.registrationDetails;
    return [];
  },

  /**
   * @summary Return special event field answers
   * @function
   *   @param {[Object]} events
   * @returns {[String]}
   */
  getSpecialAnswers: (events) => {
    const details = [];

    if (activeEvent.get() && events instanceof Array) {
      for (let i = 0; i < events.length; i += 1) {
        if (events[i].id === activeEvent.get()._id) {
          const deets = events[i].details;

          if (deets) {
            const entries = Object.entries(deets);

            for (let j = 0; j < entries.length; j += 1) {
              details.push({
                id: entries[j][0],
                value: entries[j][1],
              });
            }
          }

          return details;
        }
      }
    }
    return [];
  },
});

Template.viewRegistrations.events({
  /**
   * @summary Close Form
   * @method
   */
  'click button.close': closeForm,

  /**
   * @summary Download table as CSV
   * @method
   *   @param {$.Event} event
   */
  'click button.csv': (event) => {
    // Get data
    let data = '';
    const rows = event.target.parentElement.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i += 1) {
      const cells = rows[i].children;
      for (let j = 0; j < cells.length; j += 1) {
        const cell = cells[j].textContent
          .replace(/\r\n|[\r\n]/g, ' ')
          .replace(/\s+/g, ' ').trim();
        data += `${cell},`;
      }
      data += '\r\n';
    }

    // Prepare link
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.classList.add('hide');
    a.download = 'registrant-list.csv';

    // Add to page and click
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
});
