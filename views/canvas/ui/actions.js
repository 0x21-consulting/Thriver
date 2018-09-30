import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Canvas from '/views/canvas/canvas';

// Actions are initiated by 'data-action' attributes on elements.
// By applying specific 'data-action' attributes to elements, global app events may occur.
Template.body.events({
  /**
   * @summary Handle Sign-out
   * @method
   *   @param {$.Event} event
   */
  'click [data-action="signout"]': (event) => {
    // Prevent Navigate from acting upon link
    event.preventDefault();
    event.stopPropagation();

    // Reset canvas
    Canvas.closeSidebars();

    // Log out user
    Meteor.logout((error) => {
      if (error) throw new Meteor.Error(error);
    });
  },
});
