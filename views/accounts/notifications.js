import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { Notifications } from '/logic/accounts/schema';
import News from '/logic/news/schema';
import lastLogin from './user';

import './notifications.html';

// Subscribe to notifications
Meteor.subscribe('notifications');

// Number of notifications
const count = new ReactiveVar(0);

// Update page title with notifications count
const updateTitle = () => {
  const title = 'WCASA | Wisconsin Coalition Against Sexual Assault';
  console.log(`Notification count: ${count.get()}`);
  if (count.get() > 0) {
    document.title = `(${count.get()}) - ${title}`;
  } else document.title = title;
};

// Notification helpers
Template.notifications.helpers({
  // Whether to show the notifications section
  show: () => !!Meteor.user(),

  // Return all notifications
  notifications: () => {
    // Notifications from db (manually issued)
    const notifs = Notifications.collection.find({}).fetch();

    // Action alerts since last login
    const alerts = News.collection
      .find({ timestamp: { $gte: lastLogin.get() } }, { sort: { date: -1 } })
      .fetch();

    // Combination
    const all = notifs.concat(alerts);

    // Update total count
    count.set(all.length);

    // Update title
    updateTitle();

    return all;
  },
});

export default count;
