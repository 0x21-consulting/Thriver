import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './receipt.html';

const receipt = new ReactiveVar();

Template.receipt.helpers({
  receipt: () => receipt.get(),

  /**
   * Is this a payment or donation?
   */
  type: () => {
    // Charges
    if (receipt.get().description) {
      if (/Donation/i.test(receipt.get().description)) return 'Donation';
      return 'Payment';
    }

    // Subscriptions
    if (receipt.get().object === 'subscription') return 'Recurring Donation';

    return '';
  },

  /**
   * Name on card, if available
   */
  name: () => {
    // Subscriptions don't provide charge details for some reason
    if (receipt.get().object === 'subscription') {
      return `${Meteor.user().profile.firstname} ${Meteor.user().profile.lastname}`;
    }

    // For charges, including payments and one-time donations
    return receipt.get().metadata.name;
  },

  /**
   * Date is given in seconds; we need milliseconds
   */
  date: () => (new Date(receipt.get().created * 1000)).toLocaleString(),

  /**
   * Dollar amount is given in cents; we need dollars
   */
  dollars: () => {
    // Recurring donation
    if (receipt.get().object === 'subscription') return receipt.get().plan.amount / 100;
    return receipt.get().amount / 100;
  },

  /**
   * Description if payment is for an event
   */
  desc: () => {
    // Payment for event
    if (receipt.get().metadata.event_name) {
      return receipt.get().metadata.event_name;
    }
    // Recurring donation
    if (receipt.get().object === 'subscription') {
      const starting = (new Date(receipt.get().start * 1000)).toLocaleDateString();
      return `Donation every ${receipt.get().plan.interval} starting ${starting}`;
    }
    return 'Donation';
  },
});

/**
 * Grep receipt
 */
Template.receipt.onRendered(() => {
  const id = window.location.pathname.replace(/\/receipt\//i, '');

  if (id) {
    let payment;
    Meteor.user().payments.forEach((p) => {
      if (p.id === id) payment = p;
    });

    receipt.set(payment);
  }
});
