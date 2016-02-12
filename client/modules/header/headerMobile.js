// Events
Template.headerMobile.events({
    'click button.menuToggle': function (event) {
        if($('body').hasClass('menuOpen')){
            $('body').removeClass('menuOpen');
            } else{
            $('body').removeClass('accountOpen');
            $('body').addClass('menuOpen');
        }
    },
    'click button.accountToggle': function (event) {
        if($('body').hasClass('accountOpen')){
            $('body').removeClass('accountOpen');
        } else{
            $('body').removeClass('menuOpen');
            $('body').addClass('accountOpen');
        }
    },
    'click .mobileOverlay': function (event) {
        if($('body').hasClass('accountOpen') || $('body').hasClass('menuOpen')){
            $('body').removeClass('accountOpen');
            $('body').removeClass('menuOpen');
        }
    },
    'click .closeTabMobile': function (event) {
        if($('body').hasClass('accountOpen') || $('body').hasClass('menuOpen')){
            $('body').removeClass('accountOpen');
            $('body').removeClass('menuOpen');
        }
    }
});