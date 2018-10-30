import { Template } from 'meteor/templating';

import './alerts.html';

Template.alerts.helpers({
  alerts: [{
    message: 'If this is an emergency, please dial 911 or use our Service Provider Locator Tool to get help right away.',
    class: 'important',
  }, {
    message: 'You have been logged-out as john.doe@gmail.com. See you later John!',
    class: 'default',
  }, {
    message: 'Welcome John! You are now logged in as john.doe@gmail.com.',
    class: 'positive',
  }],
});

Template.alerts.events({
  'click [data-action=closeAlert]': () => document
    .querySelector('.alert[aria-hidden=false]').setAttribute('aria-hidden', 'true'),
});
