Template.register.helpers({
  submitValue: 'Create Account',
  signin: 'Sign in to your account',
  success: 'Registration successful!  Please check your email to verify your account.',
  items: [{
    title: 'Name',
    id: 'nameReg',
    name: 'name',
    type: 'text',
    required: 'required',
    placeholder: 'Name',
  }, {
    title: 'Email Address',
    id: 'emailReg',
    name: 'email',
    type: 'email',
    required: 'required',
    placeholder: 'Email',
  }, {
    title: 'ZIP Code',
    id: 'zip',
    name: 'zip',
    type: 'text',
    required: 'required',
    placeholder: 'ZIP Code',
    pattern: '\\d{5}(-?\\d{4})?',
  }, {
    title: 'Password',
    id: 'password',
    name: 'password',
    type: 'password',
    required: 'required',
    placeholder: 'Password',
  }, {
    title: 'Repeat Password',
    id: 'repeatPassword',
    name: 'repeat',
    type: 'password',
    required: 'required',
    placeholder: 'Repeat Password',
  }],
});

// Register Form
Template.register.events({
  /**
   * Register a new account
   * @method
   *   @param {$.Event} - Form submission event
   */
  'submit form': (event) => {
    check(event, $.Event);

    // Prevent navigation
    event.preventDefault(); event.stopPropagation();

    // Get form values
    let name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const zip = event.target.zip.value;

    // Handle login errors
    const handleError = (message) => {
      const error = event.target.querySelector('#login-error');

      error.textContent = message;
      error.classList.remove('hide');
    };

    // Enforce proper name format by removing excess spaces,
    // making all lower case, then capitalizing just the first character
    name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);

    for (let i = 0; i < name.length; i += 1) {
      name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
    }

    name = name.join(' ');

    Accounts.createUser({
      email,
      password,
      profile: {
        // Name
        firstname: name.replace(/^(.+)\s.+/, '$1'),
        lastname: name.replace(/^.+\s(.+)/, '$1'),
        zip,

        // Email subscriptions by default
        subscriptions: {
          pressReleases: true,
          actionAlerts: true,
          newsletter: true,
        },
      },
    },
      /**
       * Handle Account creation callback
       * @method
       *   @param {Error} error - Option argument passed on error
       */
      (error) => {
        if (error) {
          handleError(error);
          return;
        }

        // Send email verification email
        Meteor.call('sendVerificationEmail', Meteor.userId(), (sendError) => {
          if (sendError) {
            handleError(error);
            return;
          }

          // Notify user to check email
          document.querySelector('section#register form').classList.add('hide');
          document.querySelector('section#register p').classList.remove('hide');
        });
      });
  },

  /**
   * Ensure password is the same in both fields
   * @method
   *   @param {$.Event} event - Event received from keyup event
   */
  'keyup [name="repeat"]': (event) => {
    check(event, $.Event);

    const parent = event.target.parentElement;
    const password = parent.password;

    if (password instanceof Element) {
      if (password.value === event.target.value) {
        // Let user know passwords match
        parent.classList.remove('noMatch');

        // Allow form submit now
        parent.submitButton.disabled = false;
        return;
      }
    }

    // By default indicate there's no match
    parent.classList.add('noMatch');

    // And prevent the form from submitting until they do match
    parent.submitButton.disabled = true;
  },
});
