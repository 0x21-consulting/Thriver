// Global on purpose
lastLogin = new ReactiveVar(new Date());
organization = new ReactiveVar('');

/**
 * Determine last login and set to Reactive var
 * @method
 */
var getLastLogin = function () {
    Meteor.call('lastLogin', function (error, result) {
        // Update reactive var
        lastLogin.set(result);
    });
},

/**
 * Get the user's assigned organization, if they have one
 * @method
 */
getOrganization = function () {
    Meteor.call('getOrganization', function (error, result) {
        // Update reactive var
        organization.set(result);
    });
};

// Bind to login and on load
Template.body.onCreated(getLastLogin);
Accounts.onLogin       (getLastLogin);
Template.body.onCreated(getOrganization);
Accounts.onLogin       (getOrganization);

/**
 * Assign a user's organization upon account creation
 * @method
 *   @param {string}   token - The email verification token
 *   @param {Function} done  - Callback once verification flow is complete
 */
Accounts.onEmailVerificationLink(function (token, done) {
    // Verify email
    Accounts.verifyEmail(token, function (error) {
        if (error) {
            console.error(error);
            return;
        }
        
        // Assign organization
        Meteor.call('assignOrganization', Meteor.userId(), function () {
            // Update reactive vars
            getLastLogin();
            getOrganization();
            
            // Complete
            done();
        });
    });
});

