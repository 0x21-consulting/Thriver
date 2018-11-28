import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import StripeConstructor from 'stripe';
import { check, Match } from 'meteor/check';
import Settings from '/logic/core/settings';

let stripe;
let product;

/**
 * @summary Configure Stripe options
 */
Meteor.startup(() => {
  const settings = Settings.get('stripe') || {};
  const { secretKey } = settings;
  stripe = StripeConstructor(secretKey);

  // Check to see if there is an existing WCASA Donation product for
  // recurring donations.  If not, create one.
  stripe.products.list({ type: 'service' }, (error, products) => {
    if (error) throw new Meteor.Error(error);

    products.data.forEach((prod) => {
      if (prod.name === 'WCASA Donation') product = prod;
    });

    // If no product was found, create one
    if (!product) {
      stripe.products.create({
        name: 'WCASA Donation',
        type: 'service',
      }, (err, prod) => {
        if (err) throw new Meteor.Error(err);
        product = prod;
      });
    }
  });
});

Meteor.methods({
  /**
   * @summary Create a Stripe payment
   * @param {object} token - The payment token
   * @param {object} metadata - Metadata to store with Stripe
   */
  async pay(token, metadata) {
    check(token, Object);
    check(metadata, Match.Maybe(Object));

    let result;
    const {
      id, amount, description, recur,
    } = token;

    if (!recur || recur === 'once') {
      result = await stripe.charges.create({
        amount,
        currency: 'usd',
        description,
        source: id,
        metadata,
      });

      if (result.status === 'succeeded' && this.userId) {
        // Write to user record
        Meteor.users.update({ _id: this.userId }, { $push: { payments: result } });

        const user = Meteor.users.findOne({ _id: this.userId });
        const isDonation = /Donation/.test(result.description);

        // Send receipt email
        Email.send({
          from: 'WCASA <website@wcasa.org>',
          to: user.emails[0].address,
          subject: isDonation ? 'Donation Receipt' : 'Purchase Receipt',
          text: `Hello ${user.profile.firstname} ${user.profile.lastname
          },\n\nThank you so much for your ${isDonation ? 'donation' : 'purchase'
          } of $${result.amount / 100}.  You can access your receipt here:\n\n${
            process.env.ROOT_URL}receipt/${result.id}\n\nFrom all of us at WCASA`,
        });
      }
    } else {
      // Recurring donation
      // Start by creating a plan
      const plan = await stripe.plans.create({
        product: product.id,
        nickname: `${product.name} $${amount / 100} every ${recur}`,
        currency: 'usd',
        interval: recur,
        amount,
      });

      // Next, create a customer object that stores the payment method
      const customer = await stripe.customers.create({
        email: metadata.user_email,
        source: id, // token id
        metadata,
      });

      // Finally, subscribe customer to the plan
      result = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: plan.id }],
      });
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
