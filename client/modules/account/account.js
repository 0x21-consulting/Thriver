//Register Form
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var nameVar = event.target.registerName.value;
        var providerVar = event.target.registerProvider.value;
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        console.log("Form submitted.");
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
                    handleError('So sorry. Either you\'ve mistyped your email address, \
                        or your password is incorrect.');
                    break;
                default:
                    handleError('An unknown error has occurred.');
            }
        });
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
    }
});

Template.utility.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        else
            return '';
    }
});