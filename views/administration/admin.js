import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import History from '/views/history/history';

import './admin.html';
import './deleteSection';
import './editSection';
import './newActionAlert';
import './newSection';

/**
 * @summary Is the user an administrator?
 * @type {ReactiveVar(Boolean)}
 */
const isAdmin = new ReactiveVar(false);

/**
 * Check server for admin access
 * @method
 */
const checkAdmin = () => {
  Meteor.call('isAdmin', (error, result) => {
    // Update reactive var
    isAdmin.set(result);
  });
};

/**
 * Get admin ReactiveVar value
 * @function
 * @returns {boolean}
 */
const getAdmin = () => isAdmin.get();

// Pass admin state to templates
Template.registerHelper('isAdmin', getAdmin);

// Bind checkAdmin function
Template.body.onCreated(checkAdmin);
Accounts.onLogin(checkAdmin);
Accounts.onLogout(checkAdmin);

Template.admin.events({
  'click #admin-popout': (event) => {
    const adminControls = event.target.parentElement.querySelector('#admin-controls');
    if (adminControls instanceof Element) {
      if (adminControls.classList.contains('hide')) {
        adminControls.classList.remove('hide');
        event.target.classList.add('open');
      } else {
        adminControls.classList.add('hide');
        event.target.classList.remove('open');
      }
    }
  },
  /**
   * @summary Admin File Manager Button
   * @method
   *   @param {$.Event} event
   */
  'click #admin-file-manager': () => History.navigate('/file-manager/'),
});

// File Manager
Template.fileManager.helpers({
  title: 'File Manager',
  lists: [{
    type: 'file',
    paginate: 'true',
    perPage: 10,
    style: 'stripes',
    tag: 'files',
    items: [{
      title: 'Annual_Report_Document.jpg',
      type: 'jpg',
      date: new Date('2018-11-06'),
      url: 'https://wcasa.org/some/file.jpg',
    }],
  }],
});

export default checkAdmin;
