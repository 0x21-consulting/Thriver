import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';

// When did the user last login?
const lastLogin = new ReactiveVar(new Date());

// What is the user's paired organization?
const organization = new ReactiveVar('');

/**
 * Determine last login and set to Reactive var
 * @method
 */
const getLastLogin = () => {
  Meteor.call('lastLogin', (error, result) => {
    // Update reactive var
    lastLogin.set(result);
  });
};

/**
 * Get the user's assigned organization, if they have one
 * @method
 */
const getOrganization = () => {
  Meteor.call('getOrganization', (error, result) => {
    // Update reactive var
    organization.set(result);
  });
};

// Bind to login and on load
Template.body.onCreated(getLastLogin);
Accounts.onLogin(getLastLogin);
Template.body.onCreated(getOrganization);
Accounts.onLogin(getOrganization);

/**
 * Assign a user's organization upon account creation
 * @method
 *   @param {string}   token - The email verification token
 *   @param {Function} done  - Callback once verification flow is complete
 */
Accounts.onEmailVerificationLink((token, done) => {
  // Verify email
  Accounts.verifyEmail(token, (error) => {
    if (error) throw new Meteor.Error(error);

    // Assign organization
    Meteor.call('assignOrganization', Meteor.userId(), () => {
      // Update reactive vars
      getLastLogin();
      getOrganization();

      // Complete
      done();
    });
  });
});

export { lastLogin, organization };
