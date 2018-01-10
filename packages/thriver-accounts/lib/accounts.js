/**
 * @summary Set mail environmental settings
 * @example smtp://username:password@example.com:587
 */
Meteor.startup(() => {
  const mail = Thriver.settings.get('mail');
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

/**
 * The Organizations collection
 */
const Organizations = new Mongo.Collection('organizations');

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
   * Assign organizational association
   * @description
   *   A user's organizational association is determined by
   *   their email domain.  Therefore, only once a user has
   *   established an account and verified their email address
   *   will the association be established.
   * @method
   *   @param {string}   id       - The user's Meteor ID
   *   @param {Function} callback
   */
  assignOrganization(id, callback) {
    check(id, String);
    check(callback, Function);

    // Only get user id and emails array
    let user = Meteor.users.find({ _id: id }, { emails: 1 }).fetch();

    // Validate user
    [user] = user; // break out of array
    if (!user || !(user.emails instanceof Array)) return;

    // Get organization based on user's email domain
    const matches = Organizations.find({
      domain: user.emails[0].address.replace(/.+@(.+)/, '$1'),
    }).fetch();

    // If there's a match, associate
    if (matches instanceof Array) {
      if (matches[0]._id) {
        Meteor.users.update(
          { _id: user._id },
          { $set: { organization: matches[0]._id } },
        );
      }
    }

    // Otherwise do nothing

    // Execute callback
    if (callback instanceof Function) callback();
  },

  /**
   * Return the name of the user's designated organization association
   * @function
   * @returns {string}
   */
  getOrganization() {
    // Nothing to do if no user is logged in, or if they
    // don't have a designated organization
    if (!Meteor.user() || !Meteor.user().organization) return '';

    let organization = Organizations.find({ _id: Meteor.user().organization })
      .fetch();

    [organization] = organization; // break out of array

    if (organization && organization.name) return organization.name;

    // User has an organization but it's not found in the database
    return '';
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

  return `Hello ${user.profile.firstname}!\n\n` +
    `To verify your account email, simply click the link below.\n\n${url}\n\n` +
    'If you weren\'t expecting this email, simply delete it.\n\n' +
    'Thanks!\n\nAll of us at WCASA';
};
