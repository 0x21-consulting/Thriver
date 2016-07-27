/**
 * @summary History and Location namespace
 * @namespace Thriver.history
 */
Thriver.history = {}

// TODO: Make a location registry to allow sections to inform history api
//       how to navigate within themselves
Thriver.history.registry = {};

/**
 * @summary Update Browser's location bar
 * @method
 */
var updateLocation = function () {
    // Get Y coordinates for each page element
    // We have to regenerate this every time in case some elements
    // grow or shrink in size, of which the Work section is particularly guilty
    var coordinates = [],
        elements = document.querySelectorAll(
            'main > section'),
        i, j, k, l,
        links = document.querySelectorAll('nav.mainNav a'), link;

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
            //link.blur();
            //This allows the UI to remove unwanted :focus class to last selection
            $("header.mainHeader nav.mainNav li a").blur();

        break;
    }
},

/**
 * @summary Navigate to a section based on URL hash
 * @method
 */
navigate = function () {
    var a,

    /**
     * @summary The current URI hash
     * @type {string}
     */
    hash = document.location.hash;

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
};

// Manage Updating the Browser's Location bar, as well as reacting to changes
// in the location bar, smooth scrolling to the proper location, then passing
// additional URI parameters to the appropriately registered function.
Template.body.onRendered(function () {
    /**
     * @summary Timeout in milliseconds to wait until scroll completion to check position
     * @type {number}
     */
    var timeout = 0;

    /**
     * @summary Update Location Bar based on position on page
     * @method
     *   @param {$.Event} event - jQuery Scroll event object
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

        // Set a timeout to modify location bar about every quarter second
        timeout = setTimeout(updateLocation, 200);
    });

    // Wait a couple seconds for the page to render before navigating to the proper link
    setTimeout(navigate, 3000);
});
