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

function removeActiveClass(){
    $('.accountDetailsContent > li').removeClass('active');
}

function removeOpenAccounts(){
    document.body.classList.remove('registeredEventsM', 'subscriptionsManagerM', 'notificationsM', 'profileSettingsM');
}


//Register Form
Template.register.events({
    /**
     * Register a new account
     * @method
     *   @param {$.Event} - Form submission event
     */
    'submit form': function (event) {
        if (! (event instanceof $.Event))
            return;
        
        // Prevent navigation
        event.preventDefault(); event.stopPropagation();
        
        // Get form values
        var name     = event.target.name.value,
            email    = event.target.email.value,
            password = event.target.password.value,
            i, j,
        
        // Handle login errors    
        handleError = function (message) {
            var error = event.target.querySelector('#register-error');
            
            if (error instanceof Element)
                error.textContent = message;
        };
        
        // Enforce proper name format by removing excess spaces,
        // making all lower case, then capitalizing just the first character
        name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);
        for (i = 0, j = name.length; i < j; ++i)
            name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
        name = name.join(' ');
        
        Accounts.createUser({
            email: email,
            password: password,
            profile: {
                // Name
                firstname: name.replace(/^(.+)\s.+/, '$1'),
                lastname : name.replace(/^.+\s(.+)/, '$1'),
                
                // Email subscriptions by default
                subscriptions: {
                    pressReleases: true,
                    actionAlerts : true,
                    newsletter   : true
                }
            }
        },
        /**
         * Handle Account creation callback
         * @method
         *   @param {Error} error - Option argument passed on error
         */
        function (error) {
            if (error) {
                handleError(error);
                return;
            }
            
            // Send email verification email
            Meteor.call('sendVerificationEmail', Meteor.userId());
            
            // Notify user to check email
            document.querySelector('section.register form').classList.add('hide');
            document.querySelector('section.register p').classList.remove('hide');
        });
        
    },
    /**
     * Ensure password is the same in both fields
     * @method
     *   @param {$.Event} event - Event received from keyup event
     */
    'keyup [name="repeat"]': function (event) {
        if (! (event instanceof $.Event) )
            return;
        
        var parent   = event.target.parentElement,
            password = parent.parentElement['password'];
        
        if (password instanceof Element)
            if (password.value === event.target.value) {
                // Let user know passwords match
                parent.classList.remove('noMatch');
                // Allow form submit now
                parent.parentElement['submitButton'].disabled = false;
                return;
            }
        
        // By default indicate there's no match
        parent.classList.add('noMatch');
        // And prevent the form from submitting until they do match
        parent.parentElement['submitButton'].disabled = true;
    }
});
//Login Form
Template.login.events({
    'submit form': function (event) {
        event.preventDefault(); event.stopPropagation();
        
        var email    = event.target.email.value,
            password = event.target.password.value,
        
        // Handle login errors    
        handleError = function (message) {
            var error = event.target.querySelector('#login-error');
            
            // Show error element
            error.classList.remove('hide');
            
            if (error instanceof Element)
                error.textContent = message;
        }
        
        // Log in the user
        Meteor.loginWithPassword(email, password, function (error) {
            var overlay;
            
            // If no error, everything's fine
            if (! (error instanceof Error) ) {
                // Hide sidebars by clicking the overlay
                overlay = document.querySelector('.overlay');
                if (overlay instanceof Element)
                    overlay.click();
                return;
            }
            
            // Handle errors
            switch (error.error) {
                case 403:
                    handleError('So sorry. Either you\'ve mistyped your email address,' + 
                        ' or your password is incorrect.');
                    break;
                default:
                    handleError('An unknown error has occurred.');
            }
        });
    },
    'click section.login .showRegister': function (event) {
        document.body.classList.add('registerMob');
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

// Get the right information to each of the account templates
Template.accountDetails.helpers({
    name: function () {
        var user = Meteor.user();
        console.debug(user);
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
    },
    email: function () {
        var user = Meteor.user();
        if (user && (user.emails instanceof Array) )
            return user.emails[0].address;
    }
});

Template.accountDetails.onRendered(function () {
    if (window.innerWidth < 768) {
        removeActiveClass();
    }
});


Template.accountDetails.events({
    // Switch tabs
    'click ul.accountDetailsTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        
        // Set the active tab
        $('ul.accountDetailsTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.accountDetailsContent > li').removeClass('active');
        $('ul.accountDetailsContent > li:nth-child(' + index + ')').addClass('active');
    },
    //Temp UX Events
    'click .eventsRegistered .unregister': function (event) {
        $(event.target).parent().parent().addClass('selected');
    },
    'click .eventsRegistered .undo': function (event) {
        $(event.target).parent().parent().parent().removeClass('selected');
    },
    'click .eventsRegistered .viewEvent': function (event) {
        if (window.innerWidth >= 768) {
            $('.overlay').click();
        } else{
            removeOpenAccounts();
            $('.mobileOverlay').click();
        }
        alert('scroll down to events and show the selected event');
    },
    'click .eventsMenu .viewEvents': function (event) {
        if (window.innerWidth >= 768) {
            $('.overlay').click();
        } else{
            removeOpenAccounts();
            $('.mobileOverlay').click();
        }
        alert('scroll down to events and show the selected event');
    },
    'click section.accountDetails h3': function (event) {
        removeOpenAccounts();
    }

});

// Full name in Utility bar
Template.utility.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    }
});

// Populate Profile tab under Account Overview
Template.profile.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    organization: function () {
        return organization.get();
    },
    email: function () {
        var user = Meteor.user();
        if (user && user.emails && user.emails[0])
            return user.emails[0].address;
        return '';
    }
});
// Update Profile
Template.profile.events({
    /**
     * Handle submission of Account Settings form under Profile tab
     * @method
     *   @param {$.Event} event - Event passed by form submission
     */
    'submit form': function (event) {
        if (! (event instanceof $.Event))
            return;
        
        // Prevent navigation
        event.preventDefault(); event.stopPropagation();
        
        var name  = event.target[0].value,
            email = event.target[2].value,
            user  = Meteor.user(), i, j;
        
        // Can't do anything if not logged in
        if (!user || !user.profile) return;
        
        // Enforce proper name format by removing excess spaces,
        // making all lower case, then capitalizing just the first character
        name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);
        for (i = 0, j = name.length; i < j; ++i)
            name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
        name = name.join(' ');
        
        // Compare with db
        if (name !== ( user.profile.firstname + ' ' + user.profile.lastname )) {
            // Update profile (clients are allowed profile changes)
            Meteor.users.update({
                _id: Meteor.userId(),
            }, { $set: { 
                'profile.firstname': name.replace(/^(.+)\s.+/, '$1'),
                'profile.lastname' : name.replace(/^.+\s(.+)/, '$1')
            }});
        }
        
    }
});

// Subscriptions tab
Template.subscriptions.helpers({
    /**
     * Email Subscription to Press Releases
     */
    pressReleases: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.pressReleases;
        return false;
    },
    /**
     * Email Subscription to Action Alerts
     */
    actionAlerts: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.actionAlerts;
        return false;
    },
    /**
     * Email Subscription to the Newsletter
     */
    newsletter: function () {
        if (Meteor.user() && Meteor.user().profile)
            return Meteor.user().profile.subscriptions.newsletter;
        return false;
    }
});
Template.subscriptions.events({
    /**
     * Subscribe to something
     * @method
     *   @param {$.Event} event - Checked event
     */
    'change #subscriptions input[type="checkbox"]': function (event) {
        if (! (event instanceof $.Event) )
            return;
        
        // Get checkbox info
        var checked = event.target.checked, query;
        
        switch (event.target.id) {
            case 'pressReleasesToggle':
                query = { 'profile.subscriptions.pressReleases': checked? true : false }; break;
            case 'actionAlertsToggle':
                query = { 'profile.subscriptions.actionAlerts':  checked? true : false }; break;
            case 'newsletterToggle':
                query = { 'profile.subscriptions.newsletter':    checked? true : false }; break;
        }
        
        // Now make the change
        Meteor.users.update({ _id: Meteor.userId() }, { $set: query });
    }
});

Template.notifications.events({
    //Temp UX Alert Notes
    'click .notificationRenewal button': function (event) {
        if (window.innerWidth >= 768) {
            $('.overlay').click();
            $('li.donate').click();
        } else{
            removeOpenAccounts();
            $('.mobileOverlay').click();
            $('.menuToggle').click();
            $('.mobileMenu li.donate').click();
        }
    },
    'click .notificationApproval > button': function (event) {
        $(event.target).parent().addClass('selected');
    },
    'click .notificationApproval .undo': function (event) {
        $(event.target).parent().parent().removeClass('selected');
    },
    'click section.notifications h2': function (event) {
        removeOpenAccounts();
    }
});



