import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import Canvas from '/views/canvas/canvas';
import { smoothScroll } from './scroll';

/**
 * @summary History and Location namespace
 */
const History = {};

/**
 * @summary Scroll Event timeout constant
 * @type {number}
 */
History.TIMEOUT = 200;
Object.defineProperty(History, 'TIMEOUT', { writable: false }); // make constant

/**
 * @summary Registry for History, Routing, and Deep-Linking functionality
 * @type {Collection}
 */
History.registry = new Mongo.Collection(null);

/**
 * @summary Enforce Registry Schema
 * @type {SimpleSchema}
 */
History.schema = new SimpleSchema({
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
History.registry.attachSchema(History.schema);

/**
 * @summary Update Browser's location bar
 * @method
 */
History.updateLocation = () => {
  // Don't include special-access sections, since they're not visible on page
  const elements = History.registry
    .find({ accessFunction: { $exists: false } }).fetch();

  const links = document.querySelectorAll('nav.mainNav a');
  const sections = document.querySelectorAll('main > section');
  let link;
  let section;

  // For each registered section, get its Y coordinate
  for (let i = 0; i < elements.length; i += 1) {
    const elem = document.querySelector(`#${elements[i].element}`);
    if (elem) {
      elements[i].y = elem.offsetTop;
      elements[i].h = elem.offsetHeight;
    }
  }

  // For masthead and everything before first registered section
  if (elements[0]) {
    elements.unshift({
      element: '',
      y: 0,
      h: elements[0].y,
      currentPath: '',
    });
  }

  // Does the current scroll position match with any element?
  for (let i = 0; i < elements.length; i += 1) {
    // If this is the last element OR
    // If the section height minus the portion hidden off the screen is more
    // than half the height of the visible area, we're good.
    if (i === elements.length - 1
        || (elements[i].h - (window.scrollY - elements[i].y)) > (window.innerHeight / 2)) {
      // Update URL/location bar
      History.updateLocationBar(elements[i].currentPath);

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

      // Check if there are currently no active items: apply to masthead
      let noActiveSection = true;
      for (let k = 0; k < sections.length; k += 1) {
        if (sections[k].classList.contains('active')) noActiveSection = false;
      }
      if (noActiveSection) document.querySelector('main > section').classList.add('active');

      break;
    }
  }
};

/**
 * @summary Update the URI Location Bar
 * @method
 *   @param {String} path
 */
History.updateLocationBar = path => window.history.pushState({ path }, undefined, `/${path}`);

/**
 * @summary Update a section's path
 * @method
 *   @param {String} section - Section name to update
 *   @param {String} path    - Path to set for section
 */
History.update = (section, path) => {
  if (section.length && path.length) {
    // Update collection with new path
    History.registry.update({ element: section }, {
      $set: { currentPath: path },
    });

    // Update URI
    History.updateLocationBar(path);
  }
};

/**
 * @summary Navigate to a section based on URI path
 * @method
 *   @param {String} path - Path to navigate to
 */
History.navigate = (path) => {
  // Break into constituent parts
  const newPath = path.split(/\//)
    // Ignore empties
    .filter(element => element.length !== 0);

  // If there's no path, allow scroll to top
  if (!newPath.length) {
    smoothScroll('/');
    Canvas.closeSidebars(); // don't need these open when scrolling to top of page
  }

  // Navigate to the appropriate element, once it exists
  // TODO(micchickenburger): Test for an infinite loop if the element doesn't exist
  Tracker.autorun((c) => {
    /**
     * @summary Get registered element
     * @type {Object}
     */
    const location = History.registry.findOne({ element: newPath[0] });

    if (location) c.stop(); else return;

    // If this has a particular function used to access this component
    if (location.accessFunction instanceof Function) {
      location.accessFunction(location.accessData);
    } else {
      // Close sidebars because all sidebars would have accessFunction
      Canvas.closeSidebars();

      // Smooth scroll to element
      smoothScroll(location.element);
    }

    // Update element's stateful path
    History.update(location.element, newPath.join('/'));

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
    timeout = setTimeout(History.updateLocation, History.TIMEOUT);
  });

  History.navigate(path);
});

/**
 * @summary Handle Forward and Backward Browser buttons
 * @method
 *   @param {Event} event - Popstate event
 */
window.addEventListener('popstate', (event) => {
  // Navigate to path
  if (event.state && event.state.path) History.navigate(event.state.path);
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
    // Only for internal paths; file_open.php is a 301 redirect
    if (!event.target.pathname.match(/\/file_open.php/i)) {
      // Prevent navigation away from page
      event.preventDefault();

      // Navigate to path
      History.navigate(event.target.pathname || '/');
    }
  },
});

export default History;
