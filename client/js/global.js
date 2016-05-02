/* -All jQuery & JS usage for UI enhancements has been moved from templates
    to this document for review, improvements and to be moved as seen fit. */


Template.body.onRendered(function () {

    function mobileStatesReset(){
        if (document.body.classList.contains('fixedHeader')){
            document.body.className = "fixedHeader";
        } else{
            document.body.className = "";
        }
        var activeItems = document.getElementsByTagName('li');
        for (var i = 0; i < activeItems.length; i++) {
            if (activeItems[i].classList.contains('active')){
                activeItems[i].classList.remove('active');
            }
        }
    }

    //Window resize events
    //Vars
    var resizeTimer;
    var windowWidth = $(window).width();
    window.onresize = function(event) {
        if (windowWidth > 768 && $(window).width() < 768) {
            mobileStatesReset();
        }
        else if (windowWidth < 768 && $(window).width() > 768) {
            mobileStatesReset();
        }
        //Hide CSS Animation on Resize
        document.body.classList.add('noTransition');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.body.classList.remove('noTransition');
        }, 250);
    };

    //Insert Utility Nav Items into main nav on mobile
    //var mainNav = $('.mainNav > ul > li').detach();
    //$('nav.utility > ul').prepend(mainNav);
    //var brand = $('.brand > a').detach();
    //$('.mainHeader .mobileLinks').prepend(brand);

});


function toggleOffCanvas() {
    // Canvas Variables
    var eachToggle = document.querySelectorAll('.utilityNav > ul > li[data-sidebar]');
    var canvas = document.getElementById('canvas');
    var overlay = document.getElementById('overlay');

    //Close Canvas Elements if Overlay or active LI is clicked
    var buttonParent = event.target.parentNode;
    if(buttonParent.classList.contains('active') || event.target == overlay){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        canvas.classList.remove('offCanvasActive');
    }
    // Open Overlay and offCanvas elements if clicking inactive LI
    else if(buttonParent.hasAttribute('data-sidebar') && buttonParent.classList !== 'active'){
        for (var i = 0, element; element = eachToggle[i]; i++) {
            element.classList.remove('active');
        }
        buttonParent.classList.add('active');
        canvas.classList.add('offCanvasActive');        
    }
}

Template.body.events({
    //Canvas Actions
    'click .utilityNav > ul > li[data-sidebar] button': function (event) {
        toggleOffCanvas();
    },
    'click .overlay': function (event) {
        toggleOffCanvas();
    }
});