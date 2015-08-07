// Method to set admin properties
// Intentionally global
// TODO: Scope just between admin files
isAdmin = function () {
    var that = this; // keep in scope
    
    // Create Reactive Variable
    // If a user somehow gets admin privileges revoked, admin controls
    // would be immediately removed from the page
    this.isAdmin = new ReactiveVar(false);
    
    // Call the isAdmin method defined in server/admin.js to determine
    // whether the logged-in user is an admin or not
    Meteor.call('isAdmin', function (error, result) {
        // Update the reactive variable
        that.isAdmin.set(result);
        Session.set('isAdmin', result);
    });
};

// Bind isAdmin function
Template.body.onCreated(isAdmin);
Accounts.onLogin(isAdmin);

// Whether to show admin controls on page
Template.registerHelper('isAdmin', function () {
    return Session.get('isAdmin');
});