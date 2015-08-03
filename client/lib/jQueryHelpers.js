/* /// Notes during development ///

    -All jQuery & JS usage for UI enhancements has been moved from templates
     to this document for review, improvements and to be moved as seen fit.

    -Can we move maps.js & sections.js to the 'lib' folder?


End of notes */

Template.body.onRendered(function () {
    //Bind the 'esc' button to close any active 'modal' states
    //Scroll event which toggles between header states

    //Animate elements as they load in



    //Header State Change (window.scroll)
    //(I know this is expensive. :O Was a quick way to pull it off for showcase sake)
    window.addEventListener("scroll",function() { 
        if(window.scrollY > 160) {
            $('body').addClass('scrolled');
        }
        else {
            $('body').removeClass('scrolled');
            $('header nav').removeClass('active');
        }
    },false);

    //Menu Toggle Click
    $('.menu-toggle').click(function(){
        $('body').toggleClass('open-nav');
    });







}); //End jQuery Helpers