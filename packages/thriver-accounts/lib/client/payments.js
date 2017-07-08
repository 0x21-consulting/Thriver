Template.actpayments.helpers({
  heading: 'Donations & Payments',
  none: 'You have not made any donations or payments at this time.',
  payments: [{
    title: 'One-Time Donation',
    dateTime: '01/02/2017',
    type: 'donation-single',
    card: 'Paid using card ending in <b>0021</b>',
    amount: '$200.00',
  }, {
    title: 'Reoccuring Donation',
    dateTime: '07/12/2017',
    type: 'donation-reoccuring',
    card: 'Paid using card ending in <b>0021</b>',
    amount: '$80.00',
    close: 'Cancel Reoccuring payment',
  }, {
    title: 'Event Registration',
    event: 'WCASA Annual Meeting', // Only for events
    href: 'http://google.com', // Only for events
    dateTime: '11/05/2017',
    type: 'payment-event',
    card: 'Paid using card ending in <b>0021</b>',
    amount: '$35.00',
  }],
});


Template.actpayments.events({
  'click .act-payment a.close': (event) => {
    event.preventDefault();
    $(event.target).replaceWith('<p>Your reoccuring payment has been canceled.</p>');
  },
});
