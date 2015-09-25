// Manage Updating the Browser's Location bar, as well as reacting to changes 
// in the location bar, smooth scrolling to the proper location, then passing
// additional URI parameters to the appropraitely registered function.

Template.body.onRendered(function () {
    // The current URI
    var uri = document.location.hash,
    
    // TODO: Make this registry dynamic when NoSLB is reorganized to be modular
    registry = {},
    
    /**
     * Timeout to wait until scroll completion to check position
     * @type {number}
     */
    timeout = 0;
    /**
     * Update Location Bar based on position on page
     * @method
     */
    window.addEventListener('scroll', function (event) {
        // Why we're using timers here:
        // The scroll event will fire for every pixel (or browser/OS-specific unit)
        // scrolled, causing major performance issues, especially when interacting
        // with the DOM.
        // 
        // Instead, we use timeouts to wait for a scroll to complete before executing
        // CPU-intensive code.  For each time the event fires, the timeout is cleared,
        // essentially causing the code to wait until the event is fired for its
        // last time.
        
        // Clear the timeout
        clearTimeout(timeout);
        
        // Set a timeout to modify location bar every half second
        timeout = setTimeout(function () {
            // Get Y coordinates for each page element
            // We have to regenerate this every time in case some elements
            // grow or shrink in size, of which the Work section is particularly guilty
            var coordinates = [],
                elements = document.querySelectorAll(
                    'main.content-wrapper > section[id]'),
                i, j;
            
            for (i = 0, j = elements.length; i < j; ++i)
                coordinates.push({
                    id : elements[i].id,
                    y  : elements[i].offsetTop
                });
            
            // Does the current scroll position match with any element?
            for (i = 0, j = coordinates.length; i < j; ++i) {
                // We could probably binary search here, but meh.
                if (i !== j - 1)    // if this isn't the last element
                    if (window.scrollY > coordinates[i].y - 100)
                        if (window.scrollY > coordinates[i + 1].y - 100)
                            continue;
                            
                window.history.replaceState({}, undefined, '#' + coordinates[i].id);
                break;
            }
        }, 500);
    });
});