// Populate Profile tab under Account Overview
Template.profile.helpers({
  heading: 'Profile Overview',
  submitValue: 'Update Account',
});

// Update Profile
Template.profile.events({
    /**
     * Handle submission of Account Settings form under Profile tab
     * @method
     *   @param {$.Event} event - Event passed by form submission
     */
  'submit form': (event) => {
    check(event, $.Event);

    // Prevent navigation
    event.preventDefault(); event.stopPropagation();

    let name = event.target[0].value;
    const user = Meteor.user();

    // Can't do anything if not logged in
    if (!user || !user.profile) return;

    // Enforce proper name format by removing excess spaces,
    // making all lower case, then capitalizing just the first character
    name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);

    for (let i = 0; i < name.length; i += 1) {
      name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
    }

    name = name.join(' ');

    // Compare with db
    if (name !== (`${user.profile.firstname} ${user.profile.lastname}`)) {
      // Update profile (clients are allowed profile changes)
      Meteor.users.update({
        _id: Meteor.userId(),
      }, { $set: {
        'profile.firstname': name.replace(/^(.+)\s.+/, '$1'),
        'profile.lastname': name.replace(/^.+\s(.+)/, '$1'),
      } });
    }
  },
});

// Helpers
Template.profile.helpers({
  /**
   * @summary Pass user context to profile form
   * @function
   * @returns {Object}
   */
  doc: Meteor.user(),

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
