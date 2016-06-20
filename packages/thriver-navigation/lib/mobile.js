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
            document.body.classList.remove('noScroll');
        } else{
            h.active(event.target, true);
            h.hidden(mobileNavigation, false);
            document.body.classList.add('noScroll');
        }
    },
    'click [data-toggle=back-mobile]': function (event) {
        c.toggleCanvas();
        //alert('sr');
	        /*for (var i = 0, e; e = sidebar[i]; i++) {
                if(e)
             } //Clear all active Sidebars
             */
    },
    'click [data-type="main-navigation-item"]': function (event) {
        var toggleMobile = document.querySelectorAll('[aria-controls][data-toggle=mobile-navigation]');
        var mobileNavigation = document.getElementById('mobile-navigation');
        for (var i = 0, e; e = toggleMobile[i]; i++) { h.active(e, false);}
        h.hidden(mobileNavigation, true);
        document.body.classList.remove('noScroll');
    }
});