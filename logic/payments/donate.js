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
  pay: (token) => {
    check(token, Object);

    const { id, amount, description } = token;

    return stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      source: id,
    });
  },
});
