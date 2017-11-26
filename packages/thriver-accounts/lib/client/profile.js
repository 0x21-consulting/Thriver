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
  user: () => Meteor.user(),

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

// Events
Template.profile.events({
  'submit form': (event) => {
    check(event, $.Event);

    // Prevent Navigation
    event.preventDefault();
    event.stopPropagation();

    // Get form
    const profileForm = event.target;

    // Get form fields
    const firstname = profileForm.firstName.value;
    const lastname = profileForm.lastName.value;
    const title = profileForm.jobTitle.value;
    const address1 = profileForm.address1.value;
    const address2 = profileForm.address2.value;
    const city = profileForm.city.value;
    const state = profileForm.state.value;
    const zip = profileForm.zipCode.value;
    const telephone = profileForm.telephone.value;

    const updatedUser = {
      profile: {
        firstname,
        lastname,
        zip,
        city,
        address1,
        address2,
        state,
        telephone,
        title,
      },
    };

    // TODO: Fetch the toggle-ables

    // Update database
    Meteor.call('updateUser', updatedUser, (error, result) => {
      if (error) console.log(error);

        console.log(result);
    });
  },
});
