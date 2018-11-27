import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Toast from '/views/components/toasts';

import './forgot.html';

Template.forgotPassphrase.events({
  'submit #forgotPassphrase'(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const { submit } = form;

    // Disable submit button
    submit.disabled = true;

    // Call forgot passphrase method
    Meteor.call('forgotPassphrase', email);

    // Tell user to check email regardless of result
    Toast({ text: 'Please check your email for next steps.' });
  },
});
