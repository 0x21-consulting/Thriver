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
        event.preventDefault(); event.stopPropagation();
        
        Meteor.logout(function (error) {
            if (error instanceof Error)
                console.error(error);
        })
    }
});