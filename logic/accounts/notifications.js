import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notifications } from './schema';

// Structure
//   _id         {string}      auto_incr
//   template    {string}
//   text        {string}
//   href        {string}
//   datetime    {Date}

// @values template
//   templateGeneric        generic
//   templateApproval       access control request
//   templateRenewal        renewal notice

// Publish notifications
Meteor.publish('notifications', () => {
  // If the user is logged in
  if (this.userId) {
    return Notifications.collection.find({ userId: this.userId });
  }

  // Not logged in
  return [];
});

// Notification-related events
Meteor.methods({
  /**
   * Add a notification for a given user
   * @method
   *   @param {string} href     - the link to which the notification should reference
   *   @param {int}    template - the type of notification to display
   *   @param {string} text     - the message to display in the notification
   */
  addNotification(href, template, text) {
    // Check Authorization
    // (user must be logged in)
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    check(href, String);
    check(template, Number);
    check(text, String);

    // Add notification
    Notifications.collection.insert({
      template,
      text,
      href,
      datetime: new Date(),
    });
  },
});
