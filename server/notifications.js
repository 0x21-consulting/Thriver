// Notifications
var notifications = new Mongo.Collection('notifications');

// Structure
//   _id         {string}      auto_incr
//   template    {string}
//   text        {string}
//   userId      {string}

// @values template
//   templateGeneric        generic
//   templateApproval       access control request
//   templateRenewal        renewal notice

// Publish notifications
Meteor.publish('notifications', function () {
    // If the user is logged in
    if (this.userId) {
        return notifications.find({ userId: this.userId });
    } else
        // Not logged in
        return [];
});

// Notification-related events
Meteor.methods({
    /** 
     * Add a notification for a given user
     * @method
     *   @param {string} userId   - the ID of the user to whom to push the notifcation
     *   @param {int}    template - the type of notification to display
     *   @param {string} text     - the message to display in the notification
     */
    addNotification: function (userId, template, text) {
        // Check Authorization
        // (user must be logged in)
        if (!Meteor.userId())
            throw new Meteor.Error('not-authorized');
            
        // Mutual Suspicion
        userId    = '' + userId;
        template  = '' + template;
        text      = '' + text;
        
        // Add notification
        notifications.insert({
            userId  : userId,
            template: template,
            text    : text
        });
    }
});