import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './receipts.html';

Meteor.subscribe('donations');
Meteor.subscribe('purchases');

Template.receiptsList.helpers({
  donations: () => {
    if (Meteor.user() && Meteor.user().payments instanceof Array) {
      return Meteor.user().payments.map((donation) => {
        // Subscriptions don't have descriptions
        if (!donation.description || /WCASA Donation/i.test(donation.description)) {
          return donation;
        }
        return undefined;
      }).filter(el => el); // remove empty items
    }
    return undefined;
  },

  purchases: () => {
    if (Meteor.user() && Meteor.user().payments instanceof Array) {
      return Meteor.user().payments.map((purchase) => {
        if (purchase.description && !/WCASA Donation/i.test(purchase.description)) {
          return purchase;
        }
        return undefined;
      }).filter(el => el); // remove empty items
    }
    return undefined;
  },

  headingDonations: 'Donations',
  headingPurchases: 'Purchases',
  noneDonations: 'No donations yet.',
  nonePurchases: 'No purchases have been made.',
});

Template.receiptItem.helpers({
  timestamp() { return this.created * 1000; },
  timestampUTC() { return new Date(this.created * 1000).toISOString(); },

  description() {
    if (this.object === 'subscription') return this.plan.nickname;
    return `$${this.amount / 100} ${this.description}`;
  },
});
