function removeActiveClass(){
    $('.newsContent li').removeClass('active');
    $('.newsTabs li').removeClass('active');
    $('.accountDetailsContent > li').removeClass('active');
}

function scrollerResets(){
    var allScrollers = document.getElementsByClassName('scroller');
    for (var i = 0; i < allScrollers.length; i++) {
        allScrollers[i].scrollTop = 0;
    }
}

function removeOpenAccounts(){
    document.body.classList.remove('registeredEventsM', 'subscriptionsManagerM', 'notificationsM', 'profileSettingsM');
}

// Events
Template.headerMobile.events({

    //Menu Actions
    'click button.menuToggle': function (event) {
        if(document.body.classList.contains('menuOpen')){
            document.body.classList.remove('menuOpen');
            document.body.classList.remove('newsroomM', 'donateM', 'sidebarLeftMobile');
            //Newsroom Function
            removeActiveClass();
        } else{
            document.body.classList.remove('accountOpen');
            document.body.classList.add('menuOpen');
        }
    },
    'click button.accountToggle': function (event) {
        if(document.body.classList.contains('accountOpen')){
            document.body.classList.remove('accountOpen');
            document.body.classList.remove('newsroomM', 'donateM', 'sidebarLeftMobile');
            //Newsroom Function
            removeActiveClass();
            removeOpenAccounts();
        } else{
            document.body.classList.remove('menuOpen');
            document.body.classList.add('accountOpen');
        }
    },
    'click .mobileOverlay': function (event) {
        if(document.body.classList.contains('menuOpen') || document.body.classList.contains('accountOpen')){
            document.body.classList.remove('accountOpen');
            document.body.classList.remove('menuOpen');
            document.body.classList.remove('newsroomM', 'donateM', 'sidebarLeftMobile');
            //Newsroom Function
            removeActiveClass();
            removeOpenAccounts();
        }
    },
    'click .closeTabMobile': function (event) {
        if(document.body.classList.contains('menuOpen') || document.body.classList.contains('accountOpen')){
            document.body.classList.remove('accountOpen');
            document.body.classList.remove('menuOpen');
        }
    },

    //LI events
    'click .myAccountLink': function (event) {
        document.body.classList.remove('menuOpen');
        document.body.classList.add('accountOpen');
    },
    'click .mobileMenu .menuTitle a': function (event) {
        if(document.body.classList.contains('donateM', 'sidebarLeftMobile', 'newsroomM')){
            document.body.classList.remove('donateM', 'sidebarLeftMobile');
            //Newsroom Function
            removeActiveClass();
        } else if(document.body.classList.contains('newsroomM', 'sidebarLeftMobile')){
            document.body.classList.remove('newsroomM', 'sidebarLeftMobile');
            //Newsroom Function
            removeActiveClass();
        } else{
            document.body.classList.remove('menuOpen');
        }
    },
    'click .mobileMenu li.getHelpMobile': function (event) {
        $('.mobileOverlay').click();
        alert('Scroll to Providers.');
    },
    //Sends previous nav back to top
    'click .mobileMenu .donate': function (event) {
        document.body.classList.add('sidebarLeftMobile','donateM');
        scrollerResets();
    },
    'click .mobileMenu .newsroom': function (event) {
        document.body.classList.add('sidebarLeftMobile','newsroomM');
        scrollerResets();
    },


    //Accounts Side
    'click .mobileMenuAccount .registeredEventsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','registeredEventsM');
        scrollerResets();
    },
    'click .mobileMenuAccount .subscriptionsManagerMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','subscriptionsManagerM');
        scrollerResets();
    },
    'click .mobileMenuAccount .notificationsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','notificationsM');
        scrollerResets();
    },
    'click .mobileMenuAccount .profileSettingsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','profileSettingsM');
        scrollerResets();
    }



});