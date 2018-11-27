import { Template } from 'meteor/templating';

import './forgot.html';

Template.forgotPassphrase.events({
  'submit #forgotPassphrase'(event) {
    event.preventDefault();
  },
});
