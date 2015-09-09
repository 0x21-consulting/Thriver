// Notifications
var notifications = new Mongo.Collection('notifications');

// Structure
//   _id         {int}      auto_incr
//   type        {int}
//   text        {string}
//   userId      {string}

// Structure @type
//   0           approval
//   1           renewal notice

// Publish notifications
Meteor.publish('notifications', function () {
    // If the user is logged in
    if (this.userId) {
        notifications.find({ userId: this.userId });
    } else
        // Not logged in
        return [];
});