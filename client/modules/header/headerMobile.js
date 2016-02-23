function removeActiveClass(){
    $('.newsContent li').removeClass('active');
    $('.newsTabs li').removeClass('active');
    $('.accountDetailsContent > li').removeClass('active');
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

    //Sends previous nav back to top
    'click .mobileMenu .donate': function (event) {
        document.body.classList.add('sidebarLeftMobile','donateM');
        document.querySelector('.scroller').scrollTop = 0;
    },
    'click .mobileMenu .newsroom': function (event) {
        document.body.classList.add('sidebarLeftMobile','newsroomM');
        document.querySelector('.scroller').scrollTop = 0;
    },


    //Accounts Side
    'click .mobileMenuAccount .registeredEventsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','registeredEventsM');
        document.querySelector('.scroller').scrollTop = 0;
    },
    'click .mobileMenuAccount .subscriptionsManagerMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','subscriptionsManagerM');
        document.querySelector('.scroller').scrollTop = 0;
    },
    'click .mobileMenuAccount .notificationsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','notificationsM');
        document.querySelector('.scroller').scrollTop = 0;
    },
    'click .mobileMenuAccount .profileSettingsMob': function (event) {
        removeOpenAccounts();
        document.body.classList.add('sidebarLeftMobile','profileSettingsM');
        document.querySelector('.scroller').scrollTop = 0;
    }



});