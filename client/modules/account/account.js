function removeActiveClass(){
    $('.accountDetailsContent > li').removeClass('active');
}

function removeOpenAccounts(){
    document.body.classList.remove('registeredEventsM', 'subscriptionsManagerM', 'notificationsM', 'profileSettingsM');
}


//Register Form
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var nameVar = event.target.registerName.value;
        var providerVar = event.target.registerProvider.value;
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        console.log("Form submitted.");
    },
    'click section.register .showLogin': function (event) {
        document.body.classList.remove('registerMob');
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

Template.utility.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        else
            return '';
    }
});

Template.notifications.events({
    //Temp UX Alert Notes
    'click .notificationRenewal button': function (event) {
        $('li.donate').click();
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



