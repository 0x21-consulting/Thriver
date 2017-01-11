const formMethod = new ReactiveVar('addProvider');
const activeProvider = new ReactiveVar();

/**
 * @summary Close Provider Add/Update Admin Form
 * @method
 *   @param {$.Event} event
 */
const closeForm = (event) => {
  check(event, $.Event);

  // Close add Provider Form
  event.delegateTarget.querySelector('section.addProvider').classList.add('hide');
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
    check(event, $.Event);

    event.preventDefault();

    // Set appropriate form type
    formMethod.set('addProvider');
    activeProvider.set(null);

    const popout = event.target.parentElement.parentElement.parentElement;
    const admin = event.target.parentElement.parentElement.parentElement
      .querySelector('section.addProvider');

    if (popout instanceof Element) popout.classList.remove('full-view');
    if (admin instanceof Element) admin.classList.remove('hide');
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
  doc: () => activeProvider.get(),
});

/** Admin events for provider popout */
Template.provider.events({
  /**
   * @summary Edit Provider
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .edit': (event) => {
    check(event, $.Event);

    // Set form type to Update
    formMethod.set('updateProvider');
    activeProvider.set(Blaze.getData());

    // Hide Slider and show admin interface
    const eventsSlider = event.delegateTarget.parentElement.parentElement;

    eventsSlider.classList.add('hide');
    eventsSlider.parentElement.querySelector('section.addEvent')
      .classList.remove('hide');
  },

  /**
   * @summary Delete Provider
   * @method
   *   @param {$.Event} event
   */
  'click .adminControls .delete': (event) => {
    check(event, $.Event);

    if (confirm('Are you sure you want to delete this provicer?')) {
      Meteor.call('deleteProvider', Blaze.getData()._id);
    }
  },
});
