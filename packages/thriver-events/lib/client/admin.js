const formMethod = new ReactiveVar('addEvent');
const activeEvent = new ReactiveVar();
Thriver.events.registrations = new Mongo.Collection('registrations');

/**
 * @summary Close Event Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
const closeForm = (event) => {
  check(event, $.Event);

  // Close add Event Form
  event.delegateTarget.querySelector('.eventsSlider').classList.remove('hide');
  event.delegateTarget.querySelector('section.addEvent').classList.add('hide');
  event.delegateTarget.querySelector('section.viewRegistrations')
    .classList.add('hide');
};

/** Admin events */
Template.eventsAdmin.events({
  /**
   * @summary Close Form
   */
  'click button.close': closeForm,
  'submit #eventForm': closeForm,
});

/** Events template events */
Template.events.events({
  /**
   * @summary Show Event Add Form
   * @method
   *   @param {$.Event} event
   */
  'click li.addEvent': (event) => {
    check(event, $.Event);

    // Set appropriate form type
    formMethod.set('addEvent');
    activeEvent.set(null);

    const slider = event.delegateTarget.querySelector('.eventsSlider');
    const admin = event.delegateTarget.querySelector('section.addEvent');

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
   * @summary Document context for updates
   * @function
   * @returns {Object}
   */
  doc: () => activeEvent.get(),
});

/** Admin events for event sliders */
Template.eventSlide.events({
  /**
   * @summary Edit Event
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .edit': (event) => {
    check(event, $.Event);

    // Set form type to Update
    formMethod.set('updateEvent');
    activeEvent.set(Blaze.getData());

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
  'click .adminControls .delete': (event) => {
    check(event, $.Event);

    if (window.confirm('Are you sure you want to delete this event?')) {
      Meteor.call('deleteEvent', Blaze.getData()._id);
    }
  },

  /**
   * @summary View Registrations
   * @method
   *   @param {$.Event} event
   */
  'click li.viewRegistrations': (event) => {
    check(event, $.Event);

    // Hide slider and show Registrations
    const eventsSlider = event.delegateTarget.parentElement.parentElement;

    eventsSlider.classList.add('hide');
    eventsSlider.parentElement.querySelector('section.viewRegistrations')
      .classList.remove('hide');

    // Set active event
    activeEvent.set(Blaze.getData());
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

      return Thriver.events.registrations.find({});
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
    check(event, $.Event);

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
