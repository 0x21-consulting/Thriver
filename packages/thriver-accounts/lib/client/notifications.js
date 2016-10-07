// Subscribe to notifications
Meteor.subscribe('notifications');

// Create collection of notifications subscribed
var Notifications = new Mongo.Collection('notifications'),

// Number of notifications
count = new ReactiveVar(0),

// Update page title with notifications count
updateTitle = function () {
    var title = 'WCASA | Wisconsin Coalition Against Sexual Assault';
    
    if (count.get() > 0)
        document.title = '(' + count.get() + ') - ' + title;
    else
        document.title = title;
};

// Notification helpers
Template.notifications.helpers({
    // Whether to show the notifications section
    show: function () {
        if (Meteor.user())
            return true;
        return false;
    },
    // Return all notifications
    notifications: function () {
        // Notifications from db (manually issued)
        var notifs = Notifications.find({}).fetch(),
            i, j,
        
            // Ation alerts since last login
            alerts = Thriver.newsroom.collection.find({ date: { $gt: lastLogin.get() } }).fetch(),
        
            // Combination
            all = notifs.concat(alerts),
            
            // Week
            week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            // Month
            month = ['January','February','March','April','May','June','July','August',
                'September','October','November','December'];
        
        // Update total count
        count.set(all.length);
        
        // Update title
        updateTitle();
        
        // Normalize datasets
        for (i = 0, j = all.length; i < j; ++i) {
            // Every notification needs a template
            if (!all[i].template)
                all[i].template = 'notificationGeneric';
            
            // Alerts have titles, so assign their text
            if (!all[i].text)
                all[i].text = all[i].title;
            
            // Normalize date
            all[i].date = week[ all[i].date.getDay() ] // Sunday
                + ', ' + all[i].date.getDate() + ' '   // 6
                + month[ all[i].date.getMonth() ]      // March
                + ' '  + all[i].date.getFullYear()     // 2016
                + ' ' + (all[i].date.getHours() > 12 ? // 12
                    all[i].date.getHours() % 12 :
                    all[i].date.getHours() )
                + ':' + all[i].date.getMinutes()       // :36
                + ( all[i].date.getHours() > 11 ? ' pm' : ' am' );
        }
        
        // If no notifications, say so
        if (! all.length)
            return [{ template: 'notificationEmpty' }];
        else
            return all;
    }
    /* Notifications is already in the db schema:
    However see below for proposed data schema.
    Currently "type" would be equal to "template". If this gets change the view conditional will have to be updated.
    notification: [{
        type: 'action', //Would represent if an action is required. Could accept 'generic' as well.
        content: 'soandso@gmail.com has requested access to the account',
        actions: { //Only required if type is action
            title: 'Approve',
            action: 'approveUser', //reference some type of JS/data function
        },{
            title: 'Deny',
            action: 'denyUser', //reference some type of JS/data function
        }
    }];
    */
});

// Debug controls
/*Template.debug.events({
    // Add notification
    'click #dAddNotification button': function (event) {
        event.stopPropagation(); event.preventDefault();
        
        var parent = event.target.parentElement;
        Meteor.call('addNotification',
            parent.querySelector(':nth-child(1)').value,
            parent.querySelector(':nth-child(2)').value,
            parent.querySelector(':nth-child(3)').value);
    }
});*/

Template.notifications.events({
    //Temp UX Alert Notes
    'click .notificationRenewal button': function (event) {
        if (window.innerWidth >= 768) {
            $('.overlay').click();
            $('li.donate').click();
        } else{
            removeOpenAccounts();
            $('.mobileOverlay').click();
            $('.menuToggle').click();
            $('.mobileMenu li.donate').click();
        }
    },
    'click .notificationApproval > button': function (event) {
        $(event.target).parent().addClass('selected');
    },
    'click .notificationApproval .undo': function (event) {
        $(event.target).parent().parent().removeClass('selected');
    },
    'click section.notifications h2': function (event) {
        removeOpenAccounts();
    }
});
