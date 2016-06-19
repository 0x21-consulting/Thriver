Template.navigationMobile.helpers(mainNavigationHelpers);
Template.navigationMobile.helpers(utilityNavigationHelpers);

function scrollerResets(){
    var allScrollers = document.getElementsByClassName('scroller');
    for (var i = 0; i < allScrollers.length; i++) {
        allScrollers[i].scrollTop = 0;
    }
}

Template.navigationMobile.helpers({
});