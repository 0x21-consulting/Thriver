const paypalSdk = Npm.require('paypal-rest-sdk');

/**
 * @summary Configure PayPal options
 */
Meteor.startup(() => {
  const settings = Thriver.settings.get('paypal') || {};
  const clientId = settings.client_id || '';
  const clientSecret = settings.client_secret || '';

  paypalSdk.configure({
    mode: 'sandbox', // sandbox or live
    client_id: clientId,
    client_secret: clientSecret,
  });
});
