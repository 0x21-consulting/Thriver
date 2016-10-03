/**
 * @summary History and Location namespace
 * @namespace Thriver.history
 */
Thriver.history = {}

/**
 * @summary Registry for History, Routing, and Deep-Linking functionality
 * @type {Collection}
 */
Thriver.history.registry = new Mongo.Collection(null);

/**
 * @summary Enforce Registry Schema
 * @type {SimpleSchema}
 */
Thriver.history.schema = new SimpleSchema({
    /** Element ID to link to */
    element: {
        type: String,
        optional: false
    },
    /** For deep-link support */
    callback: {
        type: Function,
        optional: true
    },
    /** Module's current/stateful path */
    currentPath: {
        type: String,
        optional: false,
        // By default, set the currentPath to the element's ID
        autoValue: function (doc) { return doc.currentPath || doc.element }
    },
    /** Callback for special-case navigation */
    accessFunction: {
        type: Function,
        optional: true
    },
    /** Data to pass to accessFunction */
    accessData: {
        type: Object, // only way to allow anything because no 'any' type
        optional: true,
        defaultValue: {},
        blackbox: true
    }
});

// Attach Schema
Thriver.history.registry.attachSchema(Thriver.history.schema);

/**
 * @summary Update Browser's location bar
 * @method
 */
Thriver.history.updateLocation = function () {
    // Get Y coordinates for each registered page element
    // We have to regenerate this every time in case some elements
    // grow or shrink in size
    var coordinates = [],
        // Don't include special-access sections, since they're not visible on page
        elements = Thriver.history.registry.find({ 
            accessFunction: { $exists: false } }).fetch(),
        i, j, k, l,
        links = document.querySelectorAll('nav.mainNav a'), link;

    // For each registered section, get its Y coordinate
    for (i = 0, j = elements.length; i < j; ++i)
        elements[i].y = document.querySelector('#' + elements[i].element).offsetTop;

    // For masthead and everything before first registered section
    elements.unshift({ element: '', y: 0, currentPath: '' });

    // Does the current scroll position match with any element?
    for (i = 0, j = elements.length; i < j; ++i) {
        if (i !== j - 1)    // if this isn't the last element
            // 125px offset to take into account nav elements on their own canvas
            if (window.scrollY > elements[i].y - 125)
                if (window.scrollY > elements[i + 1].y - 125)
                    continue;

        // Update URL/location bar
        Thriver.history.updateLocationBar(elements[i].currentPath);

        // Remove active class from all main nav items
        for (k = 0, l = links.length; k < l; ++k)
            links[k].classList.remove('active');

        // Add active class to associated menu item
        link = document.querySelector('nav.mainNav a[href="/' +
            elements[i].element + '"]');

        if (link instanceof Element)
            link.classList.add('active');
            //link.blur();
            //This allows the UI to remove unwanted :focus class to last selection
            $('header.mainHeader nav.mainNav li a').blur();

        break;
    }
};

/**
 * @summary Update the URI Location Bar
 * @method
 *   @param {String} path
 */
Thriver.history.updateLocationBar = function (path) {
    check(path, String);

    window.history.pushState({ path: path }, undefined, '/' + path);
};

/**
 * @summary Update a section's path
 * @method
 *   @param {String} section - Section name to update
 *   @param {String} path    - Path to set for section
 */
Thriver.history.update = function (section, path) {
    check(section, String);
    check(path, String);

    // Update collection with new path
    Thriver.history.registry.update({ element: section }, {
        $set: { currentPath: path }
    });

    // Update URI
    Thriver.history.updateLocationBar(path);
};

/**
 * @summary Navigate to a section based on URI path
 * @method
 *   @param {String} path - Path to navigate to
 */
Thriver.history.navigate = function (path) {
    // Must have a path
    check(path, String);
    
    // Break into constituent parts
    path = path.split(/\//).
    
    // Ignore empties
    filter(function (element) { return element.length != 0; });

    // If there's no path, allow scroll to top
    if (!path.length) Thriver.history.smoothScroll('/');

    /**
     * @summary Get registered element
     * @type {Object}
     */
    var location = Thriver.history.registry.findOne({ element: path[0] });
    
    // Navigate to the appropriate element, if it exists
    if (location) {
        // If this has a particular function used to access this component
        if (location.accessFunction instanceof Function)
            location.accessFunction( location.accessData );
        else
            // Smooth scroll to element
            Thriver.history.smoothScroll(location.element);

        // Update element's stateful path
        Thriver.history.update(location.element, path.join('/') );

        // Now, pass the rest of the path along to the callback function
        if (location.callback instanceof Function)
            location.callback( path.slice(1) );
    }
};

/**
 * @summary Handle Page-Load Navigation
 * @function
 *   @param {String} path - Path to navigate to
 * @returns {Function}
 */
var onLoadNavigate = function (path) {
    return function () {
        Thriver.history.navigate(path);
    };
};

// Manage Updating the Browser's Location bar, as well as reacting to changes
// in the location bar, smooth scrolling to the proper location, then passing
// additional URI parameters to the appropriately registered function.
Template.canvas.onRendered(function () {
    /**
     * @summary Timeout in milliseconds to wait until scroll completion to check position
     * @type {number}
     */
    var timeout = 0,

    /** 
     * @summary When the page reloads, the URI will be overridden based on the 
     *   position while the page is rendering, preventing the client from actually
     *   navigating to the proper location.  Override that change.
     * @type {string}
     */
    path = document.location.pathname;

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
        timeout = setTimeout(Thriver.history.updateLocation, 200);
    });

    // Wait a couple seconds for the page to render before navigating to the proper link
    // TODO: Is there a better way to do this?
    setTimeout(onLoadNavigate(path), 3000);
});

/**
 * @summary Handle Forward and Backward Browser buttons
 * @method
 *   @param {Event} event - Popstate event
 */
window.addEventListener('popstate', function (event) {
    console.debug('popstate', event);
    check(event,            Event);
    check(event.state,      Object);
    check(event.state.path, Match.Maybe(String) );

    // Navigate to path
    if (event.state.path)
        Thriver.history.navigate(event.state.path);
});

/**
 * @summary Bind all anchor events that reference local resources
 *   to smooth scroll to appropriate path
 * @method
 *   @param {$.Event} event
 */
Template.body.events({
    // If href starts with a slash and is intended to remain in this tab
    'click a[href^="/"][target!="_blank"]': function (event) { console.debug('href', event.target);
        check(event, $.Event);

        // Prevent navigation away from page
        event.preventDefault();

        // Navigate to path
        Thriver.history.navigate(event.target.pathname || '/');
    }
});
