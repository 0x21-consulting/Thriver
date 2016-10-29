/**
 * @summary Is the user an administrator?
 * @type {ReactiveVar(Boolean)}
 */
const isAdmin = new ReactiveVar(false);

/**
 * Check server for admin access
 * @method
 */
const checkAdmin = () => {
  Meteor.call('isAdmin', (error, result) => {
    check(result, Boolean);

    // Update reactive var
    isAdmin.set(result);
  });
};

/**
 * Get admin ReactiveVar value
 * @function
 * @returns {boolean}
 */
const getAdmin = () => isAdmin.get();

// Pass admin state to templates
Template.registerHelper('isAdmin', getAdmin);

// Bind checkAdmin function
Template.body.onCreated(checkAdmin);
Accounts.onLogin(checkAdmin);
Accounts.onLogout(checkAdmin);
