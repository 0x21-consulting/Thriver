const formMethod = new ReactiveVar('addEvent');
const activeEvent = new ReactiveVar();

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

    if (confirm('Are you sure you want to delete this event?')) {
      Meteor.call('deleteEvent', Blaze.getData()._id);
    }
  },
});
