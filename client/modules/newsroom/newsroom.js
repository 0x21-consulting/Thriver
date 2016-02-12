// Newsroom sections
var Newsroom = new Mongo.Collection('newsroom'),

// How many list items to load
quantity = new ReactiveVar(5),

// Regular Expression for Search field
search = new ReactiveVar(),

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
handleSearch = function (event) {
    var value = event.target.value;
    
    // If field is empty, clear reactive search variable
    if (value.length === 0) search.set();
    
    // Otherwise, create RegExp for searching fields
    else search.set(new RegExp('.*' + value + '.*', 'gi') );
},

/**
 * Produce a Friendly Date string
 * @function
 *   @param {Collection} this
 * @returns {string}
 */
friendlyDate = function () {
    var date   = new Date(this.date),
        days   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'],
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'];
    
    // Create friendly date string
    return days[date.getDay()] + ', ' + date.getDate() + ' ' + 
        months[date.getMonth()] + ' ' + date.getFullYear();
};

// Subscriptions
Meteor.subscribe('inTheNews');
Meteor.subscribe('pressReleases');
Meteor.subscribe('actionAlerts');

// Populate templates
Template.inTheNews.helpers({
    news: function () {
        return Newsroom.find({
            type: 'inTheNews',
            $or: search.get() instanceof RegExp ? [{
                title: search.get() },{
                publisher: search.get()
            }] : [{}]
        }, {
            limit: quantity.get(),
            sort: { date: -1 }
        });
    },
    friendlyDate: friendlyDate
});
Template.pressReleases.helpers({
    news: function () {
        return Newsroom.find({
            type: 'pressRelease',
            $or: search.get() instanceof RegExp ? [{
                title: search.get() },{
                content: search.get()
            }] : [{}]
        }, {
            limit: quantity.get(),
            sort: { date: -1 }
        });
    },
    friendlyDate: friendlyDate
});
Template.actionAlerts.helpers({
    news: function () {
        return Newsroom.find({
            type: 'actionAlert',
            $or: search.get() instanceof RegExp ? [{
                title: search.get() },{
                content1: search.get()
            }] : [{}]
        }, {
            limit: quantity.get(),
            sort: { date: -1 }
        });
    },
    friendlyDate: friendlyDate
});

// Events
Template.news.events({
    // Switch tabs
    'click ul.newsTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        
        // Set the active tab
        $('ul.newsTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.newsContent > li').removeClass('active');
        $('ul.newsContent > li:nth-child(' + index + ')').addClass('active');
        
        // Restore number of search results to 5
        quantity.set(5);
        $('button.loadMore.everything').removeClass('everything');
    },

    'click button.loadMore': function (event) {
        quantity.set(0); // get all results
        
        // Hide "Load More Results" button
        if (event && event.target && event.target.classList)
            event.target.classList.add('everything');
    },
    
    // "Load More" Results buttons
    'click button.newsroomButton': function (event) {
        $('li.accountDetails').click();
        $('.accountDetailsTabs li:nth-child(2)').click();
    },
    
    // Search field
    'keyup  #searchNews': handleSearch,
    'search #searchNews': handleSearch,
    
    // Don't allow search to submit form on enter; it doesn't go anywhere
    'submit aside.searchFieldContainer.form': function (event) {
        event.preventDefault(); event.stopPropagation();
    }
});