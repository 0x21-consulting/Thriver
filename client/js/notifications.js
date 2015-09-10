// Subscribe to notifications
Meteor.subscribe('notifications');

// Create collection of notifications subscribed
var notifications = new Mongo.Collection('notifications');

// Notification helpers
Template.utilityNav.helpers({
    // Show notification count
    count: function () {
        var all = notifications.find({});
        // Don't return 0
        return all.count(); //? all.count() : '';
    },
    // Return all notifications
    notifications: function () {
        var all = notifications.find({});
        
        // If no notifications, say so
        if (! all.count())
            return [{ template: 'notificationEmpty' }];
        else
            return all;
    }
});

// Debug controls
Template.debug.events({
    // Add notification
    'click #dAddNotification button': function (event) {
        event.stopPropagation(); event.preventDefault();
        
        var parent = event.target.parentElement;
        Meteor.call('addNotification',
            parent.querySelector(':nth-child(1)').value,
            parent.querySelector(':nth-child(2)').value,
            parent.querySelector(':nth-child(3)').value);
    }
});