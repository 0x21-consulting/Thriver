import { Meteor } from 'meteor/meteor';

Meteor.methods({
  // Return whether or not the logged-in user is an administrator
  isAdmin: () => !!Meteor.user() && Meteor.user().admin,

  /**
   * Determine last login for user.  Returns right now if not logged in.
   * @function
   * @returns {Date}
   */
  lastLogin: () => {
    const user = Meteor.user();
    if (user && user.status && user.status.lastLogin) {
      return user.status.lastLogin.date;
    }

    return new Date();
  },
});
