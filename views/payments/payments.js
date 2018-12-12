import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import Canvas from '/views/canvas/canvas';
import History from '/views/history/history';
import { paymentDetails } from '/views/events/events';
import Settings from '/logic/core/settings';

import './payments.html';

let stripe;
let elements;
let card;
let paymentRequest;

/**
 * @summary Register Deep-linking
 * @method
 */
Template.payments.onRendered(() => {
  History.registry.insert({
    element: 'pay',
    accessData: {
      element: 'a[aria-controls="payments"]',
    },
    accessFunction: Canvas.openSidebar,
  });
});

Template.payments.helpers({
  amountTitle: 'Registration Price',
  detailsTitle: 'Payment Details',
  name: () => {
    const user = Meteor.user();

    // Just return name of logged in user
    if (user && user.profile) return `${user.profile.firstname} ${user.profile.lastname}`;

    // Otherwise
    return '';
  },
  states: () => [{
    id: 'paymentsDefault',
    content: `<h3 class="title">${paymentDetails.get().name}</h3><p>${paymentDetails.get().description}</p>`,
    active: 'true',
  }, {
    id: 'paymentSuccess',
    content: '<h2><span class="fa">&#xf004;</span> Thank you!</h2><h3>Your registration is complete.</h3><p class="text-center">You can manage your registered events <br>within your <a href="/account">account</a> on the events tab.</p>',
  }, {
    id: 'paymentFailure',
    content: '<h3>We\'re sorry, the registration was unsuccessful.<br> Please try again later.</h3><p class="text-center">You can manage your registered events <br>within your <a href="/account">account</a> on the events tab.</p>',
  }],
  amount: () => paymentDetails.get().cost,
});

// Populate form with Stripe elements
Template.payments.onRendered(() => {
  stripe = window.Stripe(Settings.get('stripePublicKey'));
  elements = stripe.elements();

  // Create credit card form elements
  card = elements.create('card');
  card.mount('#pay-card-element');
  card.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('pay-card-errors');
    if (error) displayError.textContent = error.message;
    else displayError.textContent = '';
  });

  // Support for Apple Pay, Google Pay, Microsoft Pay, etc.
  Tracker.autorun(() => {
    const { cost } = paymentDetails.get();
    if (cost) {
      paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `WCASA ${paymentDetails.get().name}`,
          amount: paymentDetails.get().cost * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const prButton = elements.create('paymentRequestButton', { paymentRequest });

      (async () => {
        // Check the availability of the Payment Request API
        const result = await paymentRequest.canMakePayment();
        if (result) prButton.mount('#payment-request-button');
        else document.querySelector('#payment-request-button').classList.add('hide');
      })();

      // Handle tokenization and send to server
      paymentRequest.on('token', async (event) => {
        console.log(event);

        const user = Meteor.user();
        const metadata = {
          event_id: paymentDetails.get().id,
          event_name: paymentDetails.get().name,
          user_id: Meteor.userId(),
          name: `${user.profile.firstname} ${user.profile.lastname}`,
          email: user.emails[0].address,
          organization: user.profile.organization,
          city: user.profile.city,
          state: user.profile.state,
          zip: user.profile.zip,
        };

        Meteor.call('pay', event.token, metadata, (err) => {
          if (err) {
            // Inform the customer that there was an error.
            const errorElement = document.getElementById('pay-card-errors');
            errorElement.textContent = err.message;
          } else {
            // success
            paymentDetails.get().callback();
          }
        });
      });
    }
  });
});

// Handle payment submission
Template.payments.events({
  async 'submit #paymentForm'(event) {
    event.preventDefault();

    // Disable submit button
    const submit = event.target.querySelector('[type="submit"]');
    submit.disabled = true;

    // Create token
    const { token, error } = await stripe.createToken(card);

    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('pay-card-errors');
      errorElement.textContent = error.message;
      submit.removeAttribute('disabled');
    } else {
      token.amount = paymentDetails.get().cost * 100;
      token.description = `WCASA ${paymentDetails.get().name}`;

      const user = Meteor.user();
      const metadata = {
        event_id: paymentDetails.get().id,
        event_name: paymentDetails.get().name,
        user_id: Meteor.userId(),
        name: `${user.profile.firstname} ${user.profile.lastname}`,
        email: user.emails[0].address,
        organization: user.profile.organization,
        city: user.profile.city,
        state: user.profile.state,
        zip: user.profile.zip,
      };

      // Send token to server
      Meteor.call('pay', token, metadata, (err) => {
        if (err) {
          // Inform the customer that there was an error.
          const errorElement = document.getElementById('pay-card-errors');
          errorElement.textContent = err.message;
        } else {
          // success
          paymentDetails.get().callback();
        }
        submit.removeAttribute('disabled');
      });
    }
  },
});
