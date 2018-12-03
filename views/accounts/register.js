import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import Canvas from '/views/canvas/canvas';
import Toast from '/views/components/toasts';

import './register.html';

Template.register.helpers({
  submitValue: 'Create Account',
  signin: 'Sign in to your account',
  success: 'Registration successful!  Please check your email to verify your account.',
  items: [{
    title: 'First Name',
    id: 'firstNameReg',
    name: 'firstName',
    type: 'text',
    required: 'required',
    placeholder: 'First Name',
  }, {
    title: 'Last Name',
    id: 'lastNameReg',
    name: 'lastName',
    type: 'text',
    required: 'required',
    placeholder: 'Last Name',
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
    title: 'Passphrase',
    id: 'register-passphrase',
    name: 'passphrase',
    type: 'password',
    required: 'required',
    placeholder: 'Passphrase',
  }, {
    title: 'Repeat Passphrase',
    id: 'register-repeat-passphrase',
    name: 'repeat',
    type: 'password',
    required: 'required',
    placeholder: 'Repeat Passphrase',
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
    // Prevent navigation
    event.preventDefault(); event.stopPropagation();

    // Get form values
    const firstname = event.target.firstName.value;
    const lastname = event.target.lastName.value;
    const email = event.target.email.value;
    const passphrase = event.target.passphrase.value;
    const zip = event.target.zip.value;

    // Handle login errors
    const handleError = (message) => {
      const error = event.target.querySelector('#login-error');

      error.textContent = message;
      error.classList.remove('hide');
    };

    Accounts.createUser(
      {
        email,
        password: passphrase,
        profile: {
          // Name
          firstname,
          lastname,
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
          document.querySelector('section#register p.register-success').classList.remove('hide');
          Toast({ text: 'Welcome to WCASA! Your account has been created.' });
        });

        // Close sidebar
        Canvas.closeSidebars();
      },
    );
  },

  /**
   * Ensure password is the same in both fields
   * @method
   *   @param {$.Event} event - Event received from keyup event
   */
  'keyup [name="repeat"]': (event) => {
    const parent = event.target.parentElement;
    const { passphrase } = parent;

    if (passphrase instanceof Element) {
      if (passphrase.value === event.target.value) {
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
