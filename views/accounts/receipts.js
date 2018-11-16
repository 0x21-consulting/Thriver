import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './receipts.html';

Meteor.subscribe('donations');
Meteor.subscribe('purchases');

Template.receiptsList.helpers({
  donations: () => {
    const user = Meteor.users.findOne({
      _id: Meteor.userId(),
      'payments.description': 'WCASA Donation',
    });
    if (user && user.payments && user.payments.length) {
      return user.payments;
    }
    return undefined;
  },

  purchases: () => {
    const user = Meteor.users.findOne({
      _id: Meteor.userId(),
      'payments.description': { $ne: 'WCASA Donation' },
    });
    if (user && user.payments && user.payments.length) {
      return user.payments;
    }
    return undefined;
  },

  timestamp() { return this.created * 1000; },
  timestampUTC() { return new Date(this.created * 1000).toISOString(); },

  total() { return this.amount / 100; },

  headingDonations: 'Donations',
  headingPurchases: 'Purchases',
  noneDonations: 'No donations yet.',
  nonePurchases: 'No purchases have been made.',
});
