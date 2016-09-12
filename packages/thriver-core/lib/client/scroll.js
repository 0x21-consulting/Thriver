/**
 * @summary Smooth scroll to a linked section
 * @method
 *   @param {string} path - Element ID to scroll to
 */
Thriver.history.smoothScroll = function (path) {
    // Sanitize path
    check(path, String);

    // Get rid of leading slashes and any sub paths
    path = path.replace(/^\/*/, '').replace(/\/.*/g, '');

    // Get target element (that the anchor links to)
    // Otherwise, default to top of screen
    var target = path? $('[id="' + path + '"]') : $('body'),

    // Where are we presently?
    posY = window.scrollY, offset, speed;

    // If no target, don't bother
    if (!target.length) return;

    // Calculate target Y offset
    offset = target.offset().top - 120;

    // We want to scroll at 750 pixels per second
    speed = Math.abs(posY - offset);

    // Smooth scroll to target
    $('.mainNav li a').removeClass('active');

    // http://stackoverflow.com/questions/8149155/animate-scrolltop-not-working-in-firefox
    $('body,html').stop(true, true).
        animate({ scrollTop: offset }, speed > 750? 750 : speed);
};

/**
 * @summary Handle scroll event
 * @method
 *   @param {$.Event} event - jQuery Event triggered by <a> element click
 */
Thriver.history.smoothScrollEventHandler = function (event) {
    // currentTarget will be an anchor element
    check(event, $.Event);
    
    // Don't allow page to navigate away
    event.preventDefault();
    event.stopPropagation();

    // Smooth scroll to anchor's href destination
    Thriver.history.navigate( event.currentTarget.pathname );
};
var smoothScrollEventHandler = Thriver.history.smoothScrollEventHandler,

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
        if ($(document).scrollTop() && $(window).width() > 767){
            document.body.classList.remove('fixedHeaderReturn');
            document.body.classList.add('fixedHeader');
        } else {
            if (document.body.classList.contains('fixedHeader')){
                document.body.classList.remove('fixedHeader');
                document.body.classList.add('fixedHeaderReturn');
            }
        }

        // Back to Top
        // TODO: move this into appropriate module
        if ($(document).scrollTop() > 1000 && $(window).width() > 767)
            document.getElementById("back-to-top").classList.add('active');
        else
            document.getElementById("back-to-top").classList.remove('active');
    }, 1);
};

// Smooth scrolling
// TODO: Modules should register smooth scroll events!!!
Template.canvas.events({ 'click #menu a'      : smoothScrollEventHandler });
Template.canvas.events({ 'click #back-to-top' : smoothScrollEventHandler });
Template.canvas.events({ 'click #staff-list'  : smoothScrollEventHandler }); // link in contact section

// Handle header state change
Template.canvas.onRendered(function () {
    window.addEventListener('scroll', handleHeaderStateChange);
});
