import { Template } from 'meteor/templating';
import Canvas from '/views/canvas/canvas';
import History from '/views/history/history';

import './payments.html';

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
  states: [{
    id: 'paymentsDefault',
    content: '<h3 class="title">Sexual Assault Victim Advocacy School</h3><p>This training addresses the basics of being a victim advocate — answering the crisis line, providing individual and systems advocacy and providing outreach in your community. Participants will have opportunities to practice skills necessary to provide comprehensive advocacy for victims. New sexual assault victim advocates, domestic violence victim advocates, and other professionals who want to learn more about sexual violence are encouraged to attend. SAVAS consists of a classroom component, in addition to a series of sessions via webinar prior to and after the training. Participants will be expected to have completed each session.</p>',
    active: 'true',
  }, {
    id: 'paymentSuccess',
    content: '<h2><span class="fa">&#xf004;</span> Thank you!</h2><h3>Your registration is complete.</h3><p class="text-center">You can manage your registered events <br>within your <a href="/account">account</a> on the events tab.</p>',
  }, {
    id: 'paymentFailure',
    content: '<h3>We\'re sorry, the registration was unsuccessful.<br> Please try again later.</h3><p class="text-center">You can manage your registered events <br>within your <a href="/account">account</a> on the events tab.</p>',
  }],
  amount: '39',
});
