import { Meteor } from 'meteor/meteor';
import StripeConstructor from 'stripe';
import { check } from 'meteor/check';
import Settings from '/logic/core/settings';

let stripe;

/**
 * @summary Configure Stripe options
 */
Meteor.startup(() => {
  const settings = Settings.get('stripe') || {};
  const { secretKey } = settings;
  stripe = StripeConstructor(secretKey);
});

Meteor.methods({
  /**
   * @summary Create a Stripe payment
   * @param {object} token - The payment token
   */
  async pay(token) {
    check(token, Object);

    const { id, amount, description } = token;

    const result = await stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      source: id,
    });

    if (result.status === 'succeeded' && this.userId) {
      // Write to user record
      Meteor.users.update({ _id: this.userId }, { $push: { payments: result } });
    }

    return result;
  },
});

/**
 * Publish user donations
 */
Meteor.publish('donations', function () {
  return Meteor.users.find({
    _id: this.userId,
    'payments.description': 'WCASA Donation',
  }, { _id: 0, payments: 1 });
});

/**
 * Publish user payments
 */
Meteor.publish('purchases', function () {
  return Meteor.users.find({
    _id: this.userId,
    'payments.description': { $ne: 'WCASA Donation' },
  }, { _id: 0, payments: 1 });
});

/**
 * Publish single receipt
 */
Meteor.publish('receipt', function (id) {
  check(id, String);

  return Meteor.users.find({
    _id: this.userId,
    'payments.id': id,
  }, { _id: 0, payments: 1 });
});
