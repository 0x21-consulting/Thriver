import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

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
});

export default checkAdmin;
