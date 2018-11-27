import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import History from '/views/history/history';
import Toast from '/views/components/toasts';

import './forgot.html';

const Token = new ReactiveVar('');

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
    History.navigate('/');
  },
});

Accounts.onResetPasswordLink((token) => {
  Token.set(token);
  History.navigate('/reset-passphrase');
});

export default Token;
