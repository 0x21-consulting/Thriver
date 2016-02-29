// Subscriptions
Providers = new Mongo.Collection('providers');
Meteor.subscribe('providers');


// Counties and other provider data
Template.providers.helpers({
    // All counties (for dropdown list)
    // NOTE: We only want to display counties which have providers,
    //       which is why we aren't using the counties collection here
    counties: function () {
        //return zipCodes.find({});
        
        // NOTE: Meteor's mongo driver still doesn't support
        //   db.collection.distinct(), so we have to hack it
        return _.chain(
            Providers.find({}, { counties: 1 }).map(function (provider) {
                return provider.counties;
        })).
        
        // provider.counties is an array, so we have to flatten them all,
        // then sort them alphabetically, then return distinct ones
        flatten().sort().uniq().value();
    },
    // The current provider
    currentProvider: function () {
        return Session.get('currentProvider');
    },
    // Current provider's counties served
    providerCounties: function () {
        return this.counties.join(', ');
    }
});

// From jQuery Helpers File
// TODO: Rewrite
Template.providers.onRendered(function () {
    //Toggle provider search
    $('.providerSearch').click(function(event){
        event.stopPropagation();
        if($('.providers .providerSearch').hasClass('active')){
            $('.providers .providerSearch').removeClass('active');
        } else{
            $('.providers .providerSearch').addClass('active');
        }
    });

    $(function() { //shorthand document.ready function
        /*$('#search').on('submit', function(e) { //use on if jQuery 1.7+
            $('.providers .provider-search').removeClass('active');
        });*/
        document.addEventListener('mouseup', closeMapSearch);
    });
});

// Close Map Search
// TODO: This is currently GLOBAL!
closeMapSearch = function (event) {
    var search = document.querySelector('.providers .providerSearch');
    if (search instanceof Element && search.classList.contains('active'))
        search.classList.remove('active');
};