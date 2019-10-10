import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import count from '/views/accounts/notifications';
import Canvas from '/views/canvas/canvas';
import Toast from '/views/components/toasts';

import './utility.html';

// Populate Profile tab under Account Overview
const utilityNavigationHelpers = {
  // Notifications
  items: [{
    // Readable Title
    title: '<span class="mobile">Notifications</span>',

    // Icon class to be applied (see icons.less)
    icon: 'bell',

    // default is false. Will place the icon :after instead of :before
    // iconAfter: true,

    // Sets Link type. (Accepts: sidebar, external, null) *Required
    type: 'sidebar',

    // which sidebar to activate. *required if type=sidebar (Should be same as sidebars.item.id).
    sidebar: 'notifications',

    // default is left (accepts: 'left', 'right')
    // position: 'right',

    // Set If item should only be active when logged in/out (accepts: 'active','inactive')
    user: 'active',

    // Set to true to add notification element
    alerts: true,

    // *required if type=external
    // url: 'wcasa.org',

    // If list item has additional elements within. Get the template
    // more: 'getHelp'
  }, {
    // Accounts
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'account',
    user: 'active',
  }, {
    // Sign In
    title: 'Sign In',
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'sign-in',
    user: 'inactive',
  }, {
    // Register
    title: 'Create an Account',
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'register',
    user: 'inactive',
  }, {
    // Forgot passphrase
    title: 'Forgot Passphrase',
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'forgot-passphrase',
    user: 'inactive',
    classes: 'hide',
  }, {
    // Reset passphrase
    title: 'Reset Passphrase',
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'reset-passphrase',
    user: 'inactive',
    classes: 'hide',
  }, {
    // Sign Out
    title: 'Sign Out',
    icon: 'caret-right',
    iconAfter: true,
    type: 'null',
    user: 'active',
    action: 'signout',
  }, {
    // Language
    title: 'Español',
    sidebar: 'espanol',
    type: 'sidebar',
    icon: 'flag',
    position: 'right',
    user: 'public',
    classes: 'transparent',
  }, {
    // Get Help
    title: 'Get Help',
    type: 'link',
    url: '/service-providers',
    icon: 'important',
    position: 'right',
    more: 'help',
    user: 'public',
  }, {
    // Donate
    title: 'Donate',
    icon: 'heart',
    type: 'sidebar',
    sidebar: 'donate',
    position: 'right',
    user: 'public',
  }, {
    // Resource Center
    title: 'Resource Center',
    icon: 'institution',
    type: 'sidebar',
    sidebar: 'resource-center',
    position: 'right',
    user: 'public',
  }, {
    // News
    title: 'News',
    icon: 'news',
    type: 'sidebar',
    sidebar: 'news',
    position: 'right',
    user: 'public',
  }, {
    // Twitter
    title: 'Twitter',
    icon: 'twitter',
    type: 'sidebar',
    sidebar: 'twitter',
    position: 'right',
    user: 'public',
  }, {
    // TODO(eoghanTadhg, michickenburger): need to create a function to open
    // sidebars not requiring a click of said button Payments (Not displayed)
    title: 'Payments',
    icon: 'ticket',
    type: 'sidebar',
    sidebar: 'payments',
    position: 'right',
    user: 'public',
  }, {
    title: 'Privacy Policy',
    icon: 'eye',
    type: 'sidebar',
    sidebar: 'legal-privacy-policy',
    position: 'right',
    user: 'public',
  }, {
    // Youtube
    title: '<span class="mobile">Youtube</span>',
    icon: 'youtube',
    type: 'link',
    url: 'https://www.youtube.com/user/WCASAVPCC',
    position: 'right',
    target: '_blank',
    user: 'public',
  }, {
    // Facebook
    title: '<span class="mobile">Facebook</span>',
    icon: 'facebook',
    type: 'link',
    url: 'https://www.facebook.com/wcasa',
    position: 'right',
    target: '_blank',
    user: 'public',
  }, {
    // File Manager
    title: 'File Manager',
    icon: 'caret-right',
    iconAfter: true,
    type: 'sidebar',
    sidebar: 'file-manager',
    user: 'active',
    classes: 'hide',
  }],
};

Template.utilityItem.helpers({
  name: () => {
    const user = Meteor.user();
    if (user && user.profile) return `${user.profile.firstname} ${user.profile.lastname}`;

    return '';
  },

  // Show notifications on bell icon
  show: () => {
    if (Meteor.user()) return true;

    return false;
  },

  // Show notification count
  count: () => count.get(),
});

Template.utility.helpers(utilityNavigationHelpers);

// Handle sign out
Template.utilityItem.events({
  'click [data-action="signout"]'(event) {
    event.preventDefault();
    Meteor.logout();
    Canvas.closeSidebars();
    Toast({ text: 'You are no longer signed in.', classes: 'neg' });
  },
});

/*  Temporarily redirect Providers section - get help - link */
Template.utility.onRendered(() => {
  const providersLink = document.querySelectorAll("#utility a[href='/service-providers']")[0] || undefined;
  if (providersLink !== undefined) {
    providersLink.setAttribute('href', 'https://wcasa.s3.us-east-2.amazonaws.com/resources/SASP+Map+%26+Contacts.pdf');
    providersLink.setAttribute('target', '_blank');
  }
});

export default utilityNavigationHelpers;
