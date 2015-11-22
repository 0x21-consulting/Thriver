// Escape feature
document.addEventListener('keydown', function (event) {
    if (event && event.keyCode && event.keyCode === 27)
        location.replace('https://en.wikipedia.org/wiki/Special:Random');
});

/* -All jQuery & JS usage for UI enhancements has been moved from templates
    to this document for review, improvements and to be moved as seen fit. */


Template.body.onRendered(function () {
    // Header State Change (window.scroll)
    var timeout = null;
    window.addEventListener('scroll', function (event) {
        // Why we're using timers here:
        // The scroll event will fire for every pixel (or browser/OS-specific unit)
        // scrolled, causing major performance issues, especially when interacting
        // with the DOM as we do here by adding and removing classes.
        // 
        // Instead, we use timeouts to wait for a scroll to complete before executing
        // CPU-intensive code.  For each time the event fires, the timeout is cleared,
        // essentially causing the code to wait until the event is fired for its
        // last time.
        
        // Clear the timeout
        clearTimeout(timeout);
        
        // Set a timeout to add the class after one tenth of a second
        timeout = setTimeout(function () {
            if (window.scrollY > 0){
                document.body.classList.add('fixed-header');
            } else {
                document.body.classList.remove('fixed-header');
                //Needed to animate unshrink of header
                document.body.classList.add('return-header');   
            }        
        }, 100);
    },false);

    // Menu Toggle Click
    document.querySelector('.menu-toggle').addEventListener('mouseup', function () {
        if (document.body.classList.contains('open-nav'))
            document.body.classList.remove('open-nav');
        else
            document.body.classList.add('open-nav');
    });

//You only want the 2 utility buttons to close the panel if their associated tab is open


    //Utility Navigation Actions (Could be rewritten)

    function clearCanvasAccount(){
        $('body').removeClass('open-twitter');
        $('body').removeClass('open-donate');
        $('body').removeClass('open-get-help');
        $('li.twitter').removeClass('active');
        $('li.donate').removeClass('active');
        $('li.get-help').removeClass('active');
    }
    function clearCanvasTwitter(){
        $('body').removeClass('open-account');
        $('body').removeClass('open-donate');
        $('body').removeClass('open-get-help');
        $('li.sign-in').removeClass('active');
        $('li.sign-up').removeClass('active');
        $('li.donate').removeClass('active');
        $('li.get-help').removeClass('active');
    }
    function clearCanvasDonate(){
        $('body').removeClass('open-account');
        $('body').removeClass('open-twitter');
        $('body').removeClass('open-get-help');
        $('li.sign-in').removeClass('active');
        $('li.sign-up').removeClass('active');
        $('li.twitter').removeClass('active');
        $('li.donate').removeClass('active');
        $('li.get-help').removeClass('active');
    }
    function clearCanvasGetHelp(){
        $('body').removeClass('open-account');
        $('body').removeClass('open-twitter');
        $('body').removeClass('open-donate');
        $('li.sign-in').removeClass('active');
        $('li.sign-up').removeClass('active');
        $('li.twitter').removeClass('active');
        $('li.donate').removeClass('active');
    }

    //Close via Overlay
    $('.overlay').click(function(){
        $('body').removeClass('open-account');
        $('body').removeClass('open-twitter');
        $('body').removeClass('open-donate');
        $('body').removeClass('open-get-help');
        $('li.sign-in').removeClass('active');
        $('li.sign-up').removeClass('active');
        $('li.twitter').removeClass('active');
        $('li.donate').removeClass('active');
        $('li.get-help').removeClass('active');
     });

    //Sign In
    $('li.sign-in').click(function(){
        $('.open-account div.create-an-account').removeClass('active');
        $('li.sign-up').removeClass('active');
        if ($('body').hasClass('open-account') && $('.open-account div.sign-in').hasClass('active')) {
           $('body').removeClass('open-account');
           $('.open-account div.sign-in').removeClass('active');
           $('li.sign-in').removeClass('active');
        } else{
            clearCanvasAccount();
            $('body').addClass('open-account'); 
            $('.open-account div.sign-in').addClass('active');
            $('li.sign-in').addClass('active');
        }
     });

    //Sign Up
    $('li.sign-up').click(function(){
        $('.open-account div.sign-in').removeClass('active');
        $('li.sign-in').removeClass('active');
        if ($('body').hasClass('open-account') && $('.open-account div.create-an-account').hasClass('active')) {
           $('body').removeClass('open-account');
           $('.open-account div.create-an-account').removeClass('active');
           $('li.sign-up').removeClass('active');
        } else{
            clearCanvasAccount();
            $('body').addClass('open-account'); 
            $('.open-account div.create-an-account').addClass('active');
            $('li.sign-up').addClass('active');
        }
     });

    //Close Sign-in
    $('.close-sign-in').click(function(){
        $('li.sign-in').removeClass('active');
        $('li.sign-up').removeClass('active');
        $('.open-account div.sign-in').removeClass('active');
        $('.open-account div.create-an-account').removeClass('active');
        $('body').removeClass('open-account');
     });

    //Twitter Feed
    $('li.twitter').click(function(){
        if($('body').hasClass('open-twitter')){
            $('body').removeClass('open-twitter');
           $('li.twitter').removeClass('active');
        } else{
            clearCanvasTwitter();
            $('body').addClass('open-twitter');
            $('li.twitter').addClass('active');
        }
     });

    //Get Help
    $('li.get-help').click(function(){
        if($('body').hasClass('open-get-help')){
            $('body').removeClass('open-get-help');
           $('li.get-help').removeClass('active');
        } else{
            clearCanvasGetHelp();
            $('body').addClass('open-get-help');
            $('li.get-help').addClass('active');
        }
     });

    //Donate
    $('li.donate').click(function(){
        if($('body').hasClass('open-donate')){
            $('body').removeClass('open-donate');
           $('li.donate').removeClass('active');
        } else{
            clearCanvasDonate();
            $('body').addClass('open-donate');
            $('li.donate').addClass('active');
        }
     });



    $('nav').click(function(){
        if ($(window).width() < 768) {
           $('body').removeClass('open-nav');
        }
     });

    
});

var smoothScroll = function (event) {
    if (!event || !event.target || !event.target.hash)
        return;
    
    event.stopPropagation();
    event.preventDefault();
    
    // Get target element (that the anchor links to)
    var target = $('[id="' + event.target.hash.slice(1) +'"]'),
    
    // Where are we presently?
    posY = event.pageY, offset, speed;
    
    // If no target, don't bother
    if (!target.length) return;
    
    // Calculate target Y offset
    offset = target.offset().top - 95;
    
    // We want to scroll at 750 pixels per second
    speed = Math.abs(posY - offset);
    
    // Smooth scroll to target
    $('body').animate({ scrollTop: offset }, speed > 3000? 3000 : speed);
};

// Smooth scrolling
// We only care about same page links (that start with a hash)
Template.body.events({ 'mousedown a[href*=#]': smoothScroll });

// Utility Nav
Template.utilityNav.onRendered(function () {
    // Toggle visibility of the Alerts
    var alerts = document.querySelectorAll('.alerts'),
        i, j, blockClose, modules,
    
    // Class swap method
    classSwap = function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var active = document.querySelectorAll('.utility-nav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
        
        this.classList.add('active');
    };
    
    console.debug(alerts);
    
    for (i = 0, j = alerts.length; i < j; ++i)
        alerts[i].addEventListener('mousedown', classSwap);
    
    // Close modules by default
    document.body.addEventListener('mousedown', function () {
        var active = document.querySelectorAll('.utility-nav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
    });
    // But not if you click in the modules
    modules = document.querySelectorAll('.notification-menu');
    blockClose = function (event) {
        event.stopPropagation();
    };
    for (i = 0, j = modules.length; i < j; ++i)
        modules[i].addEventListener('mousedown', blockClose);
    
    //Toggle visibility of Donate Tab
    $('.donate .toggle').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            $('body').addClass('donation-active');
            $('html, body').animate({ scrollTop: 0 }, "slow");
        }
    });
});

Template.donate.onRendered(function () {
    $('.donate .close-donate').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            //Do Nothing
        }
    });
});