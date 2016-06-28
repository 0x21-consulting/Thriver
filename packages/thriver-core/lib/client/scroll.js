/**
 * @summary Smooth scroll to a linked section
 * @method
 *   @param {$.Event} event - jQuery Event triggered by <a> element click
 */
var smoothScroll = function (event) {
    if (!event || !event.currentTarget || !event.currentTarget.hash)
        return;

    event.stopPropagation();
    event.preventDefault();

    // Get target element (that the anchor links to)
    var target = $('[id="' + event.currentTarget.hash.slice(1) +'"]'),

    // Where are we presently?
    posY = event.pageY, offset, speed;

    // If no target, don't bother
    if (!target.length) return;

    // Calculate target Y offset
    offset = target.offset().top - 95;

    // We want to scroll at 750 pixels per second
    speed = Math.abs(posY - offset);

    // Smooth scroll to target
    $('header.mainHeader nav.mainNav li a').removeClass('active');
    $('body').animate({ scrollTop: offset }, speed > 750? 750 : speed);
},

/**
 * @summary Timout in milliseconds to wait until scroll completion
 * @type {number}
 */
timeout = 0,

/**
 * @summary Handle Header state change on scroll
 * @method
 *   @param {$.Event} event - jQuery Scroll event triggered by user scroll
 */
handleHeaderStateChange = function (event) {
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

    // Set a timeout to add the class after one millisecond
    timeout = setTimeout(function () {
        if (window.scrollY > 0 && $(window).width() > 767){
            document.body.classList.remove('fixedHeaderReturn');
            document.body.classList.add('fixedHeader');
        } else {
            if (document.body.classList.contains('fixedHeader')){
                document.body.classList.remove('fixedHeader');
                document.body.classList.add('fixedHeaderReturn');
            }
        }
    }, 1);
};

// Smooth scrolling
// We only care about same page links (that start with a hash)
Template.body.events({ 'click #menu a[href*=#]': smoothScroll });

// Handle header state change
Template.body.onRendered(function () {
    window.addEventListener('scroll', handleHeaderStateChange);
});
