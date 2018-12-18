import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';

/**
 * @summary Action Alerts Route
 */
FlowRouter.route('/action-alert/:title', {
  name: 'App.actionAlerts',
  waitOn: params => Meteor.subscribe('actionAlert', params.title),
  action(params) {
    this.render('post', {
      category: 'Action Alert',
      logos: [{
        title: 'WCASA',
        src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
        url: 'https://wcasa.org',
      }],
      friendlyTitle: params.title,
    });
  },
});

/**
 * @summary Press Releases Route
 */
FlowRouter.route('/press-release/:title', {
  name: 'App.pressReleases',
  waitOn: params => Meteor.subscribe('pressRelease', params.title),
  action(params) {
    this.render('post', {
      category: 'Press Release',
      logos: [{
        title: 'WCASA',
        src: '/lib/img/wcasa-wisconsin-coalition-against-sexual-assault.svg',
        url: 'https://wcasa.org',
      }],
      friendlyTitle: params.title,
    });
  },
});

/**
 * @summary Receipts route
 */
FlowRouter.route('/receipt/:id', {
  name: 'App.receipts',
  waitOn: params => Meteor.subscribe('receipt', params.id),
  action() {
    this.render('receipt');
  },
});

/**
 * @summary Default route
 */
FlowRouter.route('/*', {
  name: 'App.home',
  action() {
    this.render('canvas');
  },
});
