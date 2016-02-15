// Events
Template.headerMobile.events({

    //Menu Actions
    'click button.menuToggle': function (event) {
        if(document.body.classList.contains('menuOpen')){
            document.body.classList.remove('menuOpen');
        } else{
            document.body.classList.remove('accountOpen');
            document.body.classList.add('menuOpen');
        }
    },
    'click button.accountToggle': function (event) {
        if(document.body.classList.contains('accountOpen')){
            document.body.classList.remove('accountOpen');
        } else{
            document.body.classList.remove('menuOpen');
            document.body.classList.add('accountOpen');
        }
    },
    'click .mobileOverlay': function (event) {
        if(document.body.classList.contains('menuOpen') || document.body.classList.contains('accountOpen')){
            document.body.classList.remove('accountOpen');
            document.body.classList.remove('menuOpen');
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
    'click .mobileMenu .donate': function (event) {
        document.body.classList.add('sidebarLeftMobile','donateM');
    },
    'click .mobileMenu .menuTitle a': function (event) {
        if(document.body.classList.contains('donateM', 'sidebarLeftMobile')){
            document.body.classList.remove('donateM', 'sidebarLeftMobile');
        }
    }


});