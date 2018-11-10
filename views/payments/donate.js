import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Settings from '/logic/core/settings';

import './donate.html';

let stripe;
let card;

// Populate form
Template.donate.onRendered(() => {
  stripe = window.Stripe(Settings.get('stripePublicKey'));
  const elements = stripe.elements();

  // Create form elements
  card = elements.create('card');
  card.mount('#card-element');
  card.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('card-errors');
    if (error) displayError.textContent = error.message;
    else displayError.textContent = '';
  });
});

/**
 * @summary Donate form validation and error handling
 * @method
 *   @param {Element} element - The element to target
 *   @param {string}  message - The message to display to user
 */
const donateException = (element, message) => {
  // No check on element because of old browser compatibility

  const elem = element;

  // Add error state to element
  elem.classList.add('error');
  elem.parentElement.dataset.error = `${message}`; // coercion to string
};

// Donate form helpers
Template.donate.helpers({
  amountTitle: 'Donation Amount',
  reoccurTitle: 'Donation Type',
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
  /* reoccur: [{
    value: 'Just Once',
    checked: 'checked',
  }, {
    value: 'Weekly',
  }, {
    value: 'Monthly',
  }, {
    value: 'Yearly',
  }], */

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
  'click form .custom': () => {
    const customAmount = document.getElementById('customAmt');
    customAmount.focus();
    customAmount.checked = true;
  },

  // Handle form submission
  'submit form': async (event) => {
    event.preventDefault();

    // Create token
    const { token, error } = await stripe.createToken(card);

    console.log(token);

    if (error) {
      // Inform the customer that there was an error.
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else Meteor.call('pay', token); // Send token to server
  },
});
