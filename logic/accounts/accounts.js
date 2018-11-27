import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import Settings from '/logic/core/settings';

/**
 * @summary Set mail environmental settings
 * @example smtp://username:password@example.com:587
 */
Meteor.startup(() => {
  const mail = Settings.get('mail');
  let url;

  if (mail instanceof Object) {
    url = `smtp://${
      encodeURIComponent(mail.username)
    }:${mail.password
    }@${mail.host
    }:${mail.port}`;

    process.env.MAIL_URL = url;
  }
});

/**
 * Setup first user account as an administrator
 */
Accounts.onCreateUser((options, user) => {
  const newUser = user;
  if (!Meteor.users.find().count()) {
    newUser.admin = true;
  }
  if (options.profile) {
    newUser.profile = options.profile;
  }
  return newUser;
});

Meteor.methods({
  /**
   * Handle sending email verification email
   * @method
   *   @param {String} id - Meteor user ID
   */
  sendVerificationEmail(id) {
    check(id, String);

    Accounts.sendVerificationEmail(id);
  },

  /**
   * Update a user's profile attribute
   * @function
   * @returns {object}
   */
  updateUserProfile(updatedUserProfile) {
    check(updatedUserProfile, Object);

    // Nothing to do if no user is logged in, or if they
    // don't have a designated organization
    if (!Meteor.user()) return 'User not logged in';

    Meteor.users.update({ _id: Meteor.userId() }, { $set: updatedUserProfile });
    // Execute callback
    return false;
  },
});

/**
 * Email Template details
 */
Accounts.emailTemplates.siteName = 'WCASA';
Accounts.emailTemplates.from = 'WCASA <noreply@wcasa.org>';

/**
 * Verify Email details
 */
Accounts.emailTemplates.verifyEmail.subject = (user) => {
  check(user, Object);

  return 'Verify your email address for WCASA';
};

Accounts.emailTemplates.verifyEmail.text = (user, url) => {
  check(user, Object);
  check(url, String);

  return `Hello ${user.profile.firstname}!\n\n`
    + `To verify your account email, simply click the link below.\n\n${url}\n\n`
    + 'If you weren\'t expecting this email, simply delete it.\n\n'
    + 'Thanks!\n\nAll of us at WCASA';
};
