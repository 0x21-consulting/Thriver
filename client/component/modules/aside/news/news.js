//@mcchickenburger: I suggest search be contained in a global feature which can be reused
// Newsroom sections
Newsroom = new Mongo.Collection('newsroom'),

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
};

// Subscriptions
Meteor.subscribe('inTheNews');
Meteor.subscribe('pressReleases');
Meteor.subscribe('actionAlerts');

// Events
Template.aside.events({
    //A bunch of loadmore events
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
    // "Load More" Results buttons
    'click li.newsTabMenu': function (event) {
        removeActiveClass();
    },
    
    // Search field
    'keyup  #searchNews': handleSearch,
    'search #searchNews': handleSearch,
    
    // Don't allow search to submit form on enter; it doesn't go anywhere
    'submit form#searchNewsForm': function (event) {
        event.preventDefault(); event.stopPropagation();
    }
});
