// Helpers
Template.profile.helpers({
  // Populate Profile tab under Account Overview
  heading: 'Profile Overview',
  submitValue: 'Update Account',

  /**
   * @summary Pass user context to profile form
   * @function
   * @returns {Object}
   */
  doc: Meteor.user,

  /**
   * @summary Don't include the following fields in the form
   * @function
   * @returns {String[]}
   */
  omitFields: [
    'profile.subscriptions',
    'profile.events.registeredEvents',
    'profile.online',
  ],
});
