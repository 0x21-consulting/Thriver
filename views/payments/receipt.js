import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './receipt.html';

Template.receipt.helpers({
  receipt: () => Meteor.user().payments[0],
});
