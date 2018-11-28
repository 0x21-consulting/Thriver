import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Settings from '/logic/core/settings';

import './donate.html';

const amount = new ReactiveVar(100);
let stripe;
let elements;
let card;
let paymentRequest;

/**
 * Create a payment request for Apple Pay, Google Pay, and
 * Microsoft Pay given an amount in dollars
 */
const createPaymentRequest = () => {
  paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Donation',
      amount: amount.get() * 100,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const prButton = elements.create('paymentRequestButton', { paymentRequest });

  (async () => {
    // Check the availability of the Payment Request API
    const result = await paymentRequest.canMakePayment();
    if (result) prButton.mount('#donate-payment-request-button');
    else document.querySelector('#donate-payment-request-button').classList.add('hide');
  })();

  // Handle tokenization and send to server
  paymentRequest.on('token', async (event) => {
    console.log(event.token);
    Meteor.call('pay', event.token);
  });
};

// Populate form
Template.donate.onRendered(() => {
  stripe = window.Stripe(Settings.get('stripePublicKey'));
  elements = stripe.elements();

  // Create credit card form elements
  card = elements.create('card');
  card.mount('#donate-card-element');
  card.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('donate-card-errors');
    if (error) displayError.textContent = error.message;
    else displayError.textContent = '';
  });

  // Support for Apple Pay, Google Pay, Microsoft Pay, etc.
  createPaymentRequest(amount.get());
});

// Donate form helpers
Template.donate.helpers({
  amountTitle: 'Donation Amount',
  recurTitle: 'Donation Type',
  detailsTitle: 'Payment Details',
  states: [{
    id: 'donateDefault',
    content: '<h3>Be a part of the movement to end sexual assault!</h3><p><b>You</b> play an important role in ending sexual violence. Today is the day to act on preventing sexual violence and to provide the support needed to survivors. This is our chance to educate the public about sexual violence in our state and work together for the social change necessary to end sexual violence.</p>',
    active: 'true',
  }, {
    id: 'donateSuccess',
    content: '<h2><span class="fa">&#xf004;</span> Thank you!</h2><h3>Your donation was successful.</h3><p><b>You</b> play an important role in ending sexual violence. Today is the day to act on preventing sexual violence and to provide the support needed to survivors. This is our chance to educate the public about sexual violence in our state and work together for the social change necessary to end sexual violence.</p>',
  }, {
    id: 'donateFailure',
    content: '<h3>We\'re sorry, the donation was unsuccessful.<br> Please try again later.</h3><p><b>You</b> play an important role in ending sexual violence. Today is the day to act on preventing sexual violence and to provide the support needed to survivors. This is our chance to educate the public about sexual violence in our state and work together for the social change necessary to end sexual violence.</p>',
  }],
  amount: [{ value: '25' }, { value: '50' }, { value: '100', checked: 'checked' }, { value: '200' }],
  recur: () => {
    if (Meteor.user()) {
      return [{
        text: 'Just Once',
        value: 'once',
        checked: 'checked',
      }, {
        text: 'Daily',
        value: 'day',
      }, {
        text: 'Weekly',
        value: 'week',
      }, {
        text: 'Monthly',
        value: 'month',
      }, {
        text: 'Yearly',
        value: 'year',
      }];
    }
    return undefined;
  },

  name: () => {
    const user = Meteor.user();

    // Just return name of logged in user
    if (user && user.profile) return `${user.profile.firstname} ${user.profile.lastname}`;

    // Otherwise
    return '';
  },
});

// Donate form events
Template.donate.events({
  /**
   * Clicking a donation amount should update amount to authorize
   * @param {$.Event} event
   */
  'click form [name="amount"]'(event) {
    if (event.target.value !== 'custom') {
      amount.set(parseInt(event.target.value, 10));
      paymentRequest.update({
        total: {
          // Convert to cents
          amount: amount.get() * 100,
          label: 'Donation',
        },
      });
    }
  },
  /**
   * Clicking the custom button should focus the custom input field
   */
  'click form .custom': () => {
    const customAmount = document.getElementById('customAmt');
    customAmount.focus();
    customAmount.checked = true;
  },
  /**
   * Clicking in the custom input field to set "Other" to selected
   */
  'click form .customAmt': () => {
    const custom = document.getElementById('radio5');
    custom.click();
  },
  /**
   * Updating the custom input field should update amount to authorize
   * @param {$.Event} event
   */
  'keyup form .customAmt': (event) => {
    if (!Number.isNaN(Number(event.target.value))) {
      amount.set(parseInt(event.target.value, 10));
    }
  },

  // Handle form submission
  'submit form': async (event) => {
    event.preventDefault();

    // Disable submit button
    const submit = event.target.querySelector('[type="submit"]');
    submit.disabled = true;

    // Create token
    const { token, error } = await stripe.createToken(card);

    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('donate-card-errors');
      errorElement.textContent = error.message;
    } else {
      token.amount = amount.get() * 100;
      token.description = 'WCASA Donation';
      token.recur = event.target.recur.value;

      const user = Meteor.user();
      const metadata = {};

      if (user) {
        metadata.user_id = Meteor.userId();
        metadata.user_name = `${user.profile.firstname} ${user.profile.lastname}`;
        metadata.user_email = user.emails[0].address;
      } else {
        metadata.name = event.target.querySelector('[name="name"]').value;
      }

      // Send token to server
      Meteor.call('pay', token, metadata, (err) => {
        if (err) {
          // Inform the customer that there was an error.
          const errorElement = document.getElementById('donate-card-errors');
          errorElement.textContent = err.message;
        } else {
          document.querySelector('#donateDefault').classList.add('hide');
          document.querySelector('#donateSuccess').removeAttribute('aria-hidden');
          document.querySelector('#donateForm').classList.add('hide');
        }
        submit.removeAttribute('disabled');
      });
    }
  },
});
