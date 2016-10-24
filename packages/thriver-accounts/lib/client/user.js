// When did the user last login?
Thriver.lastLogin = new ReactiveVar(new Date());

// What is the user's paired organization?
Thriver.organization = new ReactiveVar('');

/**
 * Determine last login and set to Reactive var
 * @method
 */
const getLastLogin = () => {
  Meteor.call('lastLogin', (error, result) => {
    // Update reactive var
    Thriver.lastLogin.set(result);
  });
};

/**
 * Get the user's assigned organization, if they have one
 * @method
 */
const getOrganization = () => {
  Meteor.call('getOrganization', (error, result) => {
    // Update reactive var
    Thriver.organization.set(result);
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
    if (error) throw new Meteor.error(error);

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
