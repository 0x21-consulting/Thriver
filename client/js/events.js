'use strict';

// Subscribe to events
var Events = new Mongo.Collection('events');
Meteor.subscribe('events');

// Make all events available to calendar list
Template.calendarList.helpers({
    'events': function () {
        return Events.find({});
    }
});

// Populate event with details
Template.eventListItem.helpers({
    'title': function (id) {
        // Mutual Suspicion
        id = '' + id;
        console.debug(id);
        var event = Events.findOne({ '_id': id }, { name: 1 });
        if (event && event.name)
            return event.name;
        // otherwise, something went wrong
        console.debug(event);
    },
    'start': function (id) {
        // Mutual Suspicion
        id = '' + id;
        
        // Just return the start date
        var event = Events.findOne({ '_id': id }, { start: 1 });
        if (event && event.start)
            return event.start;
        // otherwise, something went wrong
    },
    'date': function (id) {
        // Mutual Suspicion
        id = '' + id;
        
        // Get start and end dates
        var date = Events.findOne({ '_id': id }, { start: 1, end: 1 }),
            start, end;
        
        if (!date || !date.start)
            return; // no dates
        
        // Event start date
        start = new Date(date.start);
        
        // Is there an end date?
        if (date.end)
            end = new Date(date.end);
        
        console.debug(start, end);
    },
    'time': function (id) {
        // Mutual Suspicion
        id = '' + id;
        
        // Get start and end dates
        var date = Events.findOne({ '_id': id }, { start: 1, end: 1 }),
            start, end;
        
        if (!date || !date.start)
            return; // no dates
        
        // Event start date
        start = new Date(date.start);
        
        // Is there an end date?
        if (date.end)
            end = new Date(date.end);
        
        console.debug(start, end);
    }
});