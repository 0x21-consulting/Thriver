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

  year: () => {
    // Just display this and the next ten years
    const years = [];
    const thisYear = new Date().getUTCFullYear();

    for (let i = 0; i < 10; i += 1) years.push(thisYear + i);

    return years;
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
  'submit form': (event) => {
    check(event, $.Event);

    event.preventDefault();

    // Elements
    const form = event.target;
    const def = document.querySelector('#donateDefault');
    const fail = document.querySelector('#donateFailure');
    const success = document.querySelector('#donateSuccess');

    // Calculate total
    const total = form.amount.value === 'custom' ?
      document.querySelector('#customAmt').value :
      form.amount.value;

    // Disable submit button to prevent accidental double-submit
    form.querySelector('button.submit').disabled = true;

    // Clear old error messages
    const errors = form.querySelectorAll('[data-error]');
    for (let i = 0; i < errors.length; i += 1) delete errors[i].dataset.error;

    // Check parameters
    const name = form.name.value;
    const number = form.number.value.replace(/ /g, '');
    const type = form.type.value;
    const cvv2 = form.cvv2.value;
    const year = form.year.value;
    const month = form.month.value;
    check([name, number, type, cvv2, year, month], [String]);

    // Initiate Purchase
    Meteor.Paypal.purchase({ name, number, type, cvv2, year, month },
      { total, currency: 'USD' },
    (error, results) => {
      let details;

      if (error) {
        console.error('error?', error);
        return;
      }

      console.debug(results);
      // results contains:
      //   saved (true or false)
      //   if false: "error" contains the reasons for failure
      //   if true: "payment" contains the transaction information

      if (results && !results.saved) {
        // Hide default message and indicate error
        def.setAttribute('aria-hidden', 'true');
        fail.setAttribute('aria-hidden', 'false');

        // Re-enable submit button
        form.querySelector('button.submit').disabled = false;

        // Handle error details
        if (results.error.response.details) {
          details = results.error.response.details;

          for (let i = 0; i < details.length; i += 1) {
            switch (details[i].issue) {
              case 'Expiration date cannot be in the past.':
                donateException(form.year,
                  'Expiration date cannot be in the past');
                break;
              case 'The credit card number is not valid for the specified credit card type':
              case 'Value is invalid':
              case 'Must be numeric':
                switch (details[i].field) {
                  case 'payer.funding_instruments[0].credit_card':
                  case 'payer.funding_instruments[0].credit_card.number':
                    donateException(form.number, 'Invalid credit card number');
                    break;
                  case 'payer.funding_instruments[0].credit_card.cvv2':
                    donateException(form.cvv2, 'Invalid CVV2 Code');
                    break;
                  default:
                }
                break;
              case 'Amount cannot be zero':
                donateException(form.querySelector('#customAmt'),
                  'Donation amount must be greater than zero');
                break;
              case 'Length of cvv2 is invalid for the specified credit card type.':
                donateException(form.cvv2, 'Invalid CVV2 Code');
                break;
              default:
            }
          }
        }

        // If there aren't any details, check for other errors
        switch (results.error.response.name) {
          case 'CREDIT_CARD_REFUSED':
            console.error('Credit Card Refused.');
            break;
          default:
            console.error(results.error.response.name);
        }
      } else {
        // Success!  Now hide the form and display success
        form.classList.add('hide');
        def.setAttribute('aria-hidden', 'true');
        fail.setAttribute('aria-hidden', 'true');
        success.setAttribute('aria-hidden', 'false');
      }
    });
  },

  // Show credit card type
  'keyup [name="number"]': (event) => {
    check(event, $.Event);

    const ccField = event.target;

    const ccImage = ccField.parentElement.parentElement
      .querySelector('.cc-pic');

    const ccType = ccField.parentElement.parentElement
      .querySelector('[name="type"]');

    if (!ccImage || !ccType) return;

    switch (event.target.value.substr(0, 2)) {
      // American Express
      case '34':
      case '37':
        ccImage.textContent = '\uf1f3';
        ccType.value = 'amex';
        break;
      // Diners Club
      case '30': case '36': case '38': case '39':
      case '54': case '55':
        ccImage.textContent = '\uf24c'; break;
      // JCB
      case '35':
        ccImage.textContent = '\uf24b'; break;
      default:
        // Test based on first digit
        switch (event.target.value.substr(0, 1)) {
          // Discover
          case '6':
            ccImage.textContent = '\uf1f2';
            ccType.value = 'discover';
            break;
          // Maestro/Mastercard
          case '5':
            ccImage.textContent = '\uf1f1';
            ccType.value = 'mastercard';
            break;
          // Visa
          case '4':
            ccImage.textContent = '\uf1f0';
            ccType.value = 'visa';
            break;
          default:
            ccImage.textContent = ' ';
            ccType.value = 'mastercard';
        }
    }

    // Based on credit card type, space out the numbers

    // If this is the backspace key, ignore
    if (event.keyCode === 8) return;

    // American Express and Diners Club cards indent at 4 and 10
    if (ccType.value === 'amex') {
      if (event.target.value.length === 4 || event.target.value.length === 11) {
        ccField.value += ' ';
        return;
      }
      // Otherwise, don't indent at all
      return;
    }

    // All other credit cards have a space after 4, 8, and 12
    if (event.target.value.length === 4 || event.target.value.length === 9
        || event.target.value.length === 14) {
      ccField.value += ' ';
      return;
    }
  },
});
