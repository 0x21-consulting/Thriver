const paypalSdk = Npm.require('paypal-rest-sdk');

/**
 * @summary Configure PayPal options
 */
Meteor.startup(() => {
  paypalSdk.configure({
    mode: 'sandbox', // sandbox or live
    client_id: Thriver.settings.get('paypal').client_id,
    client_secret: Thriver.settings.get('paypal').client_secret,
  });
});
