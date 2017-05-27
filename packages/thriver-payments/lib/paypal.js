/**
 * @summary PayPal API, adapted from David Brear's mrt:paypal package
 * @link https://github.com/DavidBrear/meteor-paypal/
 */
Meteor.Paypal = {
  accountOptions: {},

  // authorize submits a payment authorization to Paypal
  authorize: (cardInfo, paymentInfo, callback) => {
    Meteor.call('paypalSubmit', 'authorize', cardInfo, paymentInfo, callback);
  },
  purchase: (cardInfo, paymentInfo, callback) => {
    Meteor.call('paypalSubmit', 'sale', cardInfo, paymentInfo, callback);
  },

  // config is for the paypal configuration settings.
  config: function accountOptionsAssign(options) {
    this.accountOptions = options;
  },
  paymentJson: () => ({
    intent: 'sale',
    payer: {
      payment_method: 'credit_card',
      funding_instruments: [],
    },
    transactions: [],
  }),

  // parseCardData splits up the card data and puts it into a paypal friendly format.
  parseCardData: (data) => {
    let firstName = '';
    let lastName = '';
    if (data.name) {
      firstName = data.name.split(' ')[0];
      lastName = data.name.split(' ')[1];
    }
    return {
      credit_card: {
        type: data.type,
        number: data.number,
        first_name: firstName,
        last_name: lastName,
        cvv2: data.cvv2,
        expire_month: data.month,
        expire_year: data.year,
      },
    };
  },

  // parsePaymentData splits up the card data and gets it into a paypal friendly format.
  parsePaymentData: data => ({ amount: { total: data.total, currency: data.currency } }),
};

if (Meteor.isServer) {
  Meteor.startup(() => {
    const paypalSdk = Npm.require('paypal-rest-sdk');
    Npm.require('fibers');
    const Future = Npm.require('fibers/future');

    Meteor.methods({
      paypalSubmit(transactionType, cardData, paymentData) {
        check(transactionType, String);
        check([cardData, paymentData], [Object]);

        const paymentJson = Meteor.Paypal.paymentJson();
        paymentJson.intent = transactionType;

        if (cardData == null) {
          paymentJson.payer = { paymentMethod: 'paypal' };
          paymentJson.redirectUrls = Meteor.Paypal.accountOptions.redirectUrls;
        } else {
          paymentJson.payer.funding_instruments.push(Meteor.Paypal.parseCardData(cardData));
        }
        paymentJson.transactions.push(Meteor.Paypal.parsePaymentData(paymentData));

        const fut = new Future();
        this.unblock();
        paypalSdk.payment.create(paymentJson, Meteor.bindEnvironment((err, payment) => {
          if (err) {
            fut.return({ saved: false, error: err });
          } else {
            fut.return({ saved: true, payment });
          }
        },
        (e) => { console.error(e); }));
        return fut.wait();
      },
    });

    // this is not a method because it should really only be
    // called by server-side code
    Meteor.Paypal.execute = function execute(paymentId, payerId, callback) {
      paypalSdk.payment.execute(paymentId, { payerId }, Meteor.Paypal.accountOptions, callback);
    };
  });
}
