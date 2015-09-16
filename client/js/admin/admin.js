// Is the user an admin?
var isAdmin = new ReactiveVar(false),

/**
 * Check server for admin access
 * @method
 */
checkAdmin = function () {
    Meteor.call('isAdmin', function (error, result) {
        // Update reactive var
        isAdmin.set(result);
    });
},

/**
 * Get admin ReactiveVar value
 * @function
 * @returns {boolean}
 */
getAdmin = function () {
    return isAdmin.get();
};

// Pass admin state to templates
Template.body     .helpers({ isAdmin: getAdmin });
Template.callout  .helpers({ isAdmin: getAdmin });
Template.community.helpers({ isAdmin: getAdmin });
Template.contact  .helpers({ isAdmin: getAdmin });
Template.providers.helpers({ isAdmin: getAdmin });
Template.who      .helpers({ isAdmin: getAdmin });
Template.work     .helpers({ isAdmin: getAdmin });
Template.article  .helpers({ isAdmin: getAdmin });

// Bind checkAdmin function
Template.body.onCreated(checkAdmin);
Accounts     .onLogin  (checkAdmin);