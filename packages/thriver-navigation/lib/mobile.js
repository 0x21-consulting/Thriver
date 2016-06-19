Template.navigationMobile.helpers(mainNavigationHelpers);
Template.navigationMobile.helpers(utilityNavigationHelpers);

function scrollerResets(){
    var allScrollers = document.getElementsByClassName('scroller');
    for (var i = 0; i < allScrollers.length; i++) {
        allScrollers[i].scrollTop = 0;
    }
}

Template.navigationMobile.events({
    'click [aria-controls][data-toggle=mobile-navigation]': function (event) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        if(event.target.getAttribute('aria-expanded') == 'true'){
            h.active(event.target, false);
            h.hidden(mobileNavigation, true);
        } else{
            h.active(event.target, true);
            h.hidden(mobileNavigation, false);
        }
    }
});
