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
        c.toggleCanvas(); //START HERE
    },
    'click [data-type="main-navigation-item"]': function (event) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        for (var i = 0, e; e = toggleMobile[i]; i++) { h.active(e, false);}
        h.hidden(mobileNavigation, true);
        document.body.classList.remove('noScroll');
    },
    'click #mobile-navigation li > a[href="#service-providers"]': function (event) {
        m.toggleMore();
        event.preventDefault();
        return false;

    },
    'click #mobile-navigation figure a[href="#service-providers"]': function (event) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        for (var i = 0, e; e = toggleMobile[i]; i++) { h.active(e, false);}
        h.hidden(mobileNavigation, true);
        document.body.classList.remove('noScroll');
    }
});