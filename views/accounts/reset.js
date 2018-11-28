import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import Toast from '/views/components/toasts';
import History from '/views/history/history';
import Token from './forgot';

import './reset.html';

Template.resetPassphrase.events({
  'submit #resetPassphrase'(event) {
    event.preventDefault();

    const passphrase = event.target.passphrase.value;

    Accounts.resetPassword(Token.get(), passphrase, (error) => {
      if (error) {
        const elem = event.target.querySelector('#reset-error');

        elem.textContent = error;
        elem.classList.remove('hide');
      } else {
        Toast({ text: 'Passphrase reset successfully.' });
        History.navigate('/');
      }
    });
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
        parent.submit.disabled = false;
        return;
      }
    }

    // By default indicate there's no match
    parent.classList.add('noMatch');

    // And prevent the form from submitting until they do match
    parent.submit.disabled = true;
  },
});
