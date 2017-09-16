/**
 * @summary History and Location namespace
 * @namespace Thriver.history
 */
Thriver.history = {};

/**
 * @summary Scroll Event timeout constant
 * @type {number}
 */
Thriver.history.TIMEOUT = 200;
Object.defineProperty(Thriver.history, 'TIMEOUT', { writable: false }); // make constant

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
    optional: false,
  },
  /** For deep-link support */
  callback: {
    type: Function,
    optional: true,
  },
  /** Module's current/stateful path */
  currentPath: {
    type: String,
    optional: false,
    // By default, set the currentPath to the element's ID
    autoValue: doc => doc.currentPath || doc.element,
  },
  /** Callback for special-case navigation */
  accessFunction: {
    type: Function,
    optional: true,
  },
  /** Data to pass to accessFunction */
  accessData: {
    type: Object, // only way to allow anything because no 'any' type
    optional: true,
    defaultValue: {},
    blackbox: true,
  },
});

// Attach Schema
Thriver.history.registry.attachSchema(Thriver.history.schema);

/**
 * @summary Update Browser's location bar
 * @method
 */
Thriver.history.updateLocation = () => {
  // Don't include special-access sections, since they're not visible on page
  const elements = Thriver.history.registry.find({
    accessFunction: { $exists: false } }).fetch();

  const links = document.querySelectorAll('nav.mainNav a');
  const sections = document.querySelectorAll('main > section');
  let link;
  let section;

  // For each registered section, get its Y coordinate
  for (let i = 0; i < elements.length; i += 1) {
    elements[i].y = document.querySelector(`#${elements[i].element}`).offsetTop;
    elements[i].h = document.querySelector(`#${elements[i].element}`).offsetHeight;
  }

  // For masthead and everything before first registered section
  elements.unshift({ element: '', y: 0, h: elements[0].y, currentPath: '' });

  // Does the current scroll position match with any element?
  for (let i = 0; i < elements.length; i += 1) {
    // If this is the last element OR
    // If the section height minus the portion hidden off the screen is more
    // than half the height of the visible area, we're good.
    if (i === elements.length - 1 ||
        (elements[i].h - (window.scrollY - elements[i].y)) > (window.innerHeight / 2)) {
      // Update URL/location bar
      Thriver.history.updateLocationBar(elements[i].currentPath);

      // Remove active class from all main nav items and sections
      for (let k = 0; k < links.length; k += 1) links[k].classList.remove('active');
      for (let k = 0; k < sections.length; k += 1) sections[k].classList.remove('active');

      // Add active class to associated menu item
      link = document.querySelector(`nav.mainNav a[href="/${elements[i].element}"]`);
      section = document.querySelector(`main > section[id="${elements[i].element}"]`);

      if (link instanceof Element) {
        link.classList.add('active');
        section.classList.add('active');

        // This allows the UI to remove unwanted :focus class to last selection
        $('header#menu nav.mainNav > ul li[data-type="main-navigation-item"] a').blur();
      }

      break;
    }
  }
};

/**
 * @summary Update the URI Location Bar
 * @method
 *   @param {String} path
 */
Thriver.history.updateLocationBar = (path) => {
  check(path, String);

  window.history.pushState({ path }, undefined, `/${path}`);
};

/**
 * @summary Update a section's path
 * @method
 *   @param {String} section - Section name to update
 *   @param {String} path    - Path to set for section
 */
Thriver.history.update = (section, path) => {
  check(section, String);
  check(path, String);

  // Update collection with new path
  Thriver.history.registry.update({ element: section }, {
    $set: { currentPath: path },
  });

  // Update URI
  Thriver.history.updateLocationBar(path);
};

/**
 * @summary Navigate to a section based on URI path
 * @method
 *   @param {String} path - Path to navigate to
 */
Thriver.history.navigate = (path) => {
  // Must have a path
  check(path, String);

  // Break into constituent parts
  const newPath = path.split(/\//)
    // Ignore empties
    .filter(element => element.length !== 0);

  // If there's no path, allow scroll to top
  if (!newPath.length) Thriver.history.smoothScroll('/');

  // Navigate to the appropriate element, once it exists
  // TODO(micchickenburger): Test for an infinite loop if the element doesn't exist
  Tracker.autorun((c) => {
    /**
     * @summary Get registered element
     * @type {Object}
     */
    const location = Thriver.history.registry.findOne({ element: newPath[0] });

    if (location) c.stop(); else return;

    // If this has a particular function used to access this component
    if (location.accessFunction instanceof Function) {
      location.accessFunction(location.accessData);
    } else {
      // Close sidebars because all sidebars would have accessFunction
      Thriver.canvas.closeSidebars();

      // Smooth scroll to element
      Thriver.history.smoothScroll(location.element);
    }

    // Update element's stateful path
    Thriver.history.update(location.element, newPath.join('/'));

    // Now, pass the rest of the path along to the callback function
    if (location.callback instanceof Function) location.callback(newPath.slice(1));
  });
};

// Manage Updating the Browser's Location bar, as well as reacting to changes
// in the location bar, smooth scrolling to the proper location, then passing
// additional URI parameters to the appropriately registered function.
Template.canvas.onRendered(() => {
  /**
   * @summary Timeout in milliseconds to wait until scroll completion to check position
   * @type {number}
   */
  let timeout = 0;

  /**
   * @summary When the page reloads, the URI will be overridden based on the
   *   position while the page is rendering, preventing the client from actually
   *   navigating to the proper location.  Override that change.
   * @type {string}
   */
  const path = document.location.pathname;

  /**
   * @summary Update Location Bar based on position on page
   * @method
   *   @param {$.Event} event - jQuery Scroll event object
   */
  window.addEventListener('scroll', () => {
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
    timeout = setTimeout(Thriver.history.updateLocation, Thriver.history.TIMEOUT);
  });

  Thriver.history.navigate(path);
});

/**
 * @summary Handle Forward and Backward Browser buttons
 * @method
 *   @param {Event} event - Popstate event
 */
window.addEventListener('popstate', (event) => {
  check(event, Event);
  check(event.state, Object);
  check(event.state.path, Match.Maybe(String));

  // Navigate to path
  if (event.state.path) Thriver.history.navigate(event.state.path);
});

/**
 * @summary Bind all anchor events that reference local resources
 *   to smooth scroll to appropriate path
 * @method
 *   @param {$.Event} event
 */
Template.body.events({
  // If href starts with a slash and is intended to remain in this tab
  'click a[href^="/"][target!="_blank"]': (event) => {
    check(event, $.Event);

    // Prevent navigation away from page
    event.preventDefault();

    // Navigate to path
    Thriver.history.navigate(event.target.pathname || '/');
  },
});
