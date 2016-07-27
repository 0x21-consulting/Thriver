Template.register.helpers({
    submitValue: function () {
        return 'Create Account';
    },
    signin: function () {
        return 'Sign in to your account';
    },
    success: function () {
        return 'Registration successful!  Please check your email to verify your account.';
    },
    items: [{
        title: 'Name',
        id: 'nameReg',
        type: 'name',
        required: 'required',
        placeholder: 'Name'
    },{
        title: 'Email Address',
        id: 'emailReg',
        type: 'email',
        required: 'required',
        placeholder: 'Email'
    },{
        title: 'Password',
        id: 'passwordReg',
        type: 'password',
        required: 'required',
        placeholder: 'Password'
    },{
        title: 'Repeat Password',
        id: 'repeatPasswordReg',
        type: 'password',
        required: 'required',
        placeholder: 'Repeat Password'
    }]
});

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
