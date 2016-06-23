Template.signin.helpers({
    submitValue: function () {
        return 'Sign In';
    },
    register: function () {
        return 'Create an Account';
    },
    items: [{
        title: 'Email',
        id: 'signinEmail',
        type: 'email',
        required: 'required',
        placeholder: 'Email'
    },{ 
        title: 'Password',
        id: 'signinPassword',
        type: 'password',
        required: 'required',
        placeholder: 'Password'
    }]
});

//Signin Form
Template.signin.events({
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
    }
});
