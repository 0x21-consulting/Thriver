import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './receipts.html';

Meteor.subscribe('donations');
Meteor.subscribe('purchases');

Template.receiptsList.helpers({
  donations: () => Meteor.users.findOne({
    _id: Meteor.userId(),
    'payments.description': 'WCASA Donation',
  }).payments,

  purchases: () => Meteor.users.findOne({
    _id: Meteor.userId(),
    'payments.description': { $ne: 'WCASA Donation' },
  }).payments,

  timestamp() { return this.created * 1000; },
  timestampUTC() { return new Date(this.created * 1000).toISOString(); },

  total() { return this.amount / 100; },
});
