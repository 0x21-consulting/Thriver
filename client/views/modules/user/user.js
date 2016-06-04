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



Template.utility.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    // Show notifications on bell icon
    show: function () {
        if (Meteor.user())
            return true;
        return false;
    },
    // Show notification count
    count: function () {
        // Return count
        return count.get();
    }
});

// Logout
Template.utility.events({
    'click li.logout button': function (event) {
        document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
        event.preventDefault(); event.stopPropagation();
        Meteor.logout(function (error) {
            if (error instanceof Error)
                console.error(error);
        })
    }
});

