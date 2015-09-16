// Subscribe to notifications
Meteor.subscribe('notifications');

// Create collection of notifications subscribed
var notifications = new Mongo.Collection('notifications');

// Notification helpers
Template.utilityNav.helpers({
    // Whether to show the notifications section
    show: function () {
        if (Meteor.user())
            return true;
        
        // Reset title
        // TODO: Is this the best place for this?
        document.title = 'WCASA';
        
        return false;
    },
    // Show notification count
    count: function () {
        var all   = notifications.find({}),
            count = all.count();
        
        // Update title bar
        if (count)
            document.title = '(' + count + ') - WCASA';
        else
            document.title = 'WCASA';
        
        // Return count
        return count;
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