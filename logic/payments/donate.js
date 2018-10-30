import { Meteor } from 'meteor/meteor';
import paypalSdk from 'paypal-rest-sdk';
import Settings from '/logic/core/settings';

import './paypal';

/**
 * @summary Configure PayPal options
 */
Meteor.startup(() => {
  const settings = Settings.get('paypal') || {};
  const clientId = settings.client_id || '';
  const clientSecret = settings.client_secret || '';

  paypalSdk.configure({
    mode: 'sandbox', // sandbox or live
    client_id: clientId,
    client_secret: clientSecret,
  });
});
