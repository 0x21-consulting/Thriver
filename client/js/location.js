// Manage Updating the Browser's Location bar, as well as reacting to changes 
// in the location bar, smooth scrolling to the proper location, then passing
// additional URI parameters to the appropraitely registered function.

Template.body.onRendered(function () {
    // The current URI hash
    var hash = document.location.hash, a,
    
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
                    'div.masterContainer > section.mainSection'),
                i, j, k, l, links = document.querySelectorAll('nav.mainNav a'), link;
            
            // For masthead and everything before first main section
            coordinates.push({ id: '', y: 0 });
            
            // For each main section, get its Y coordinate
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
                
                // Update URL/location bar
                window.history.replaceState({}, undefined, '#' + coordinates[i].id);
                
                // Remove active class from all main nav items
                for (k = 0, l = links.length; k < l; ++k)
                    links[k].classList.remove('active');
                
                // Add active class to associated menu item
                link = document.querySelector('nav.mainNav a[href="#' + 
                    coordinates[i].id + '"]');
                if (link instanceof Element)
                    link.classList.add('active');
                    //This allows the UI to remove unwanted :focus class to last selection
                    $("header.mainHeader nav.mainNav li a").blur(); 
                break;
            }
        }, 200);
    });
    
    // Wait a couple seconds for the page to render before navigating to the proper link
    setTimeout(function () {
        // Check to see if there is a hashed location in the URI bar.  If there is, navigate
        // to it.  The browser can't do it on its own because the Meteor site is dynamically
        // generated, so the section with the proper ID doesn't actually exist, yet.
        if (hash) {
            // To accomplish this, create a link and click it for the user
            a = document.createElement('a');
            a.href = hash;
            a.classList.add('hide'); // don't show the link
            document.body.appendChild(a);
            
            // Click the link
            a.click();
            
            // Then remove the link
            a.parentElement.removeChild(a);
        }
    }, 3000);
});