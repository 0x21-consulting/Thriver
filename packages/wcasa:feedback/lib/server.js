/**
 * @summary Publish feedback to admin interface
 * @method
 */

Meteor.publish('feedback', () => {
  // Check authorization
  if (!Meteor.userId() || !Meteor.user().admin) {
    throw new Meteor.Error('not-authorized');
  }

  // Publish
  return Thriver.feedback.collection.find();
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
    Thriver.feedback.collection.insert({
      path,
      comments,
      userId: Meteor.userId(),
    });
  },
});
