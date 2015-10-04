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

// From jQuery Helpers file
// TODO: Rewrite this
Template.community.onRendered(function () {
    // Carousel Function
    $('.carousel nav li').click(function(){
        var left = parseInt($('.carousel main').css('left'));
        var carouselWidth = $('.carousel main').outerWidth();
        if($(this).hasClass('prev')){
            if(left == 0 ){
                // do nothing
            }
            else { 
                var prevLeft = left + carouselWidth;
                $('section.carousel main').css({left: prevLeft});
            }
        }
        if($(this).hasClass('next')){
            var end = $('section.carousel main article').length * $('.carousel main').outerWidth();
            var endSplit = end / 2 - $('.carousel main').outerWidth();
            if(left == - endSplit){
                // do nothing
            }
            else { 
                var nextLeft = left - carouselWidth;
                $('section.carousel main').css({left: nextLeft});
            }
        }
    });
    $('.details-ref').click(function(){
        $('section.carousel').addClass('active');
     });
    $('.close-carousel').click(function(){
        $('section.carousel').removeClass('active');
     });


    //Toggle visibility of the List View in Events
    $('h4.list-view').click(function(){
        $('body').addClass('calendar-list-hide');
    });
    $('span.show-list').click(function(){
        $('body').removeClass('calendar-list-hide');
    });
});