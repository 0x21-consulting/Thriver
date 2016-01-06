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
                document.body.classList.add('fixedHeader');
            } else {
                document.body.classList.remove('fixedHeader');
                // Needed to animate unshrink of header
                document.body.classList.add('returnHeader');   
            }
        }, 1);
    },false);
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