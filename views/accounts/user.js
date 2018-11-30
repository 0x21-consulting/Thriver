import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';

// When did the user last login?
const lastLogin = new ReactiveVar(new Date());

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

// Bind to login and on load
Template.body.onCreated(getLastLogin);
Accounts.onLogin(getLastLogin);
Accounts.onLogout(getLastLogin);

/**
 * Update lastLogin upon account creation
 * @method
 *   @param {string}   token - The email verification token
 *   @param {Function} done  - Callback once verification flow is complete
 */
Accounts.onEmailVerificationLink((token, done) => {
  // Verify email
  Accounts.verifyEmail(token, (error) => {
    if (error) throw new Meteor.Error(error);

    // Update reactive vars
    getLastLogin();

    // Complete
    done();
  });
});

export default lastLogin;
