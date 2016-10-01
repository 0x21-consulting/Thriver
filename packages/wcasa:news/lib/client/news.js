//@micchickenburger: I suggest search be contained in a global feature which can be reused
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
    /**
     * @summary Load More
     * @method
     *   @param {$.Event} event
     */
    'click li.loadMore button': function (event) {
        check(event, $.Event);
        check(event.target, Element)

        // Get all results
        quantity.set(0);
        
        // Hide "Load More Results" button
        event.target.classList.add('hide');
    },
    
    // Search field
    'keyup  #searchNews, search #searchNews': handleSearch,
    
    /**
     * @summary Prevent form submission
     * @method
     *   @param {$.Event} event
     */
    'submit form#searchNewsForm': function (event) {
        check(event, $.Event);

        // Prevent form submission
        event.preventDefault();
    }
});
