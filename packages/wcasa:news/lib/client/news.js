// How many list items to load
Thriver.newsroom.quantity = new ReactiveVar(5);

// Regular Expression for Search field
Thriver.newsroom.search = new ReactiveVar();

/**
 * Handle searching
 * @method
 *   @param {Event} event
 */
let handleSearch = function (event) {
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
Meteor.subscribe('newsletters');

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
        Thriver.newsroom.quantity.set(0);
        
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
    },

    /** 
     * @summary Show Add Newsroom Item form
     * @method
     *   @param {$.Event} event
     */
    'click aside.admin button.add': function (event) {
        check(event, $.Event);

        // Show form
        document.querySelector('#newsForm').classList.remove('hide');
    }
});

// Administrative events
Template.list.events({
    /**
     * @summary Delete a newsroom item
     * @method
     *   @param {$.Event} event
     */
    'click article[role="document"] aside.admin button.delete': function (event) {
        check(event, $.Event);

        event.stopPropagation(); console.debug(this)

        if ( confirm('Are you sure you want to delete this Newsroom Item?') )
            Meteor.call('deleteNewsItem', this._id);
    }
});
