import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Feedback from './schema';

/**
 * @summary Publish feedback to admin interface
 * @method
 */
Meteor.publish('feedback', function publishFeedback() {
  // Publish
  if (this.userId && Meteor.users.findOne({ _id: this.userId }).admin) {
    return Feedback.collection.find();
  }

  return [];
});

Meteor.methods({
  /**
   * @summary Add feedback
   * @method
   *   @param {string} path - Element path in markup
   *   @param {string} comments - User comments
   */
  addFeedback: (path, comments) => {
    // Check authorization
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Parameter checks
    check(path, Match.Maybe(String));
    check(comments, String);

    // Add feedback
    Feedback.collection.insert({
      path,
      comments,
      userId: Meteor.userId(),
    });
  },
});
