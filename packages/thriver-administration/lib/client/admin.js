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
Template.registerHelper('isAdmin', getAdmin);

// Bind checkAdmin function
Template.body.onCreated(checkAdmin);
Accounts     .onLogin  (checkAdmin);