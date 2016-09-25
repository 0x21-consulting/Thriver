Template.navigationMobile.helpers(mainNavigationHelpers);
Template.navigationMobile.helpers(utilityNavigationHelpers);

function scrollerResets(){
    var allScrollers = document.getElementsByClassName('scroller');
    for (var i = 0; i < allScrollers.length; i++) {
        allScrollers[i].scrollTop = 0;
    }
}

Template.navigationMobile.events({
    'click [aria-controls][data-toggle=mobile-navigation]': function (e) {
        Thriver.canvas.toggleCanvas(); //START HERE
    },
    'click [data-type="main-navigation-item"]': function (e) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        for (var i = 0, e; e = toggleMobile[i]; i++) { Thriver.util.makeActive(e, false);}
        Thriver.util.hide(mobileNavigation, true);
        document.body.classList.remove('noScroll');
    },
    'click #mobile-navigation li > a[href="#service-providers"]': function (e) {
        m.toggleMore;
        event.preventDefault();
        return false;

    },
    'click #mobile-navigation figure a[href="#service-providers"]': function (e) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        for (var i = 0, e; e = toggleMobile[i]; i++) { Thriver.util.makeActive(e, false);}
        Thriver.util.hide(mobileNavigation, true);
        document.body.classList.remove('noScroll');
    }
});
