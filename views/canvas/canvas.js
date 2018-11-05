import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Settings from '/logic/core/settings';
import Util from '/views/canvas/ui/util';

import './canvas.html';
import './preloader';
import './markdown';

// Import History later because it depends on the canvas template
import History from '/views/history/history';

Template.canvas.onCreated(function () {
  this.subscribe('sections');
});

// Canvas.js is dedicated to managing canvas events.
// This includes how the canvas/off-canvas elements open/close and relate.
const Canvas = {
  /**
   * @summary Remove Overlay
   * @method
   */
  removeOverlay: () => {
    // Canvas element
    const canvas = document.querySelector('#canvas');

    // Prevent body scrolling
    document.body.classList.remove('noScroll');

    // Open canvas
    canvas.dataset.canvasState = '';
  },

  /**
   * @summary Close sidebars
   * @method
   */
  closeSidebars: () => {
    // Get all sidebars and links that happen to be open
    const sidebars = document.querySelectorAll('.sidebar[aria-hidden="false"]');
    const links = document.querySelectorAll('a[data-toggle="canvas"][aria-expanded="true"]');

    // Close all sidebars
    for (let i = 0; i < sidebars.length; i += 1) Util.hide(sidebars[i]);

    // Reset links
    for (let i = 0; i < links.length; i += 1) {
      Util.makeActive(links[i], false);
      links[i].removeEventListener('click', Canvas.handleCloseButton);
    }

    // Remove overlay
    Canvas.removeOverlay();

    // Update Location Bar
    History.updateLocation();
  },

  /**
   * @summary Add Overlay
   * @method
   */
  addOverlay: () => {
    // Canvas element
    const canvas = document.querySelector('#canvas');

    // Prevent body scrolling
    document.body.classList.add('noScroll');

    // Open canvas
    canvas.dataset.canvasState = 'open';
  },

  /**
   * @summary Open Sidebar
   * @method
   *   @param {Object} data - Show the sidebar in this data object
   */
  openSidebar: (data) => {
    // First, close any open sidebars
    Canvas.closeSidebars();

    // Wait for element to render
    const render = () => {
      // Get canvas and sidebars
      const element = document.querySelector(data.element);

      // Can't open a sidebar that doesn't exist
      if (!(element instanceof Element)) {
        Meteor.defer(render);
        return;
      }

      const canvas = document.querySelector('#canvas');
      const sidebar = document.querySelector(`#${element.getAttribute('aria-controls')}.sidebar`);

      // Open Overlay
      Canvas.addOverlay();

      // Make link active
      Util.makeActive(element);

      // Make sidebar active
      Util.hide(sidebar, false);

      // Set width
      canvas.dataset.canvasWidth = sidebar.dataset.width;
      canvas.dataset.canvasPosition = sidebar.dataset.position;

      // Bind closure
      element.addEventListener('click', Canvas.handleCloseButton);

      // Set Mobile Menu Open
      Util.makeActive(document.getElementById('mobile-toggle'), true);
    };

    render();
  },

  /**
   * @summary Handle close button
   * @method
   *   @param {Event|$.Event} event
   */
  handleCloseButton: (event) => {
    // Prevent anchor link from reopening sidebar while we're trying to close it
    event.stopPropagation();
    event.preventDefault();

    Canvas.closeSidebars();
  },

  /**
   * @summary Handle opening and closing of mobile hamburger menu
   * @method
   *   @param {$.Event} event
   */
  mobileMenu: (event) => {
    const toggle = document.getElementById('mobile-toggle');
    const navigation = document.getElementById('mobile-navigation');

    const openMenu = () => {
      // Open menu
      Util.makeActive(toggle);
      Util.hide(navigation, false);

      // Prevent scrolling
      document.body.classList.add('noScroll');
    };

    // Close menu if it's currently open
    if (event.target.getAttribute('aria-expanded') === 'true') {
      // Sometimes sidebars are opened without the menu, so let's open the menu
      // now so that something appears when the sidebar is closed
      openMenu();

      // Hide visible menu items
      let elems = document.querySelectorAll('.off-canvas menu.tabs li [aria-expanded="true"]');
      for (let i = 0, tab = elems[i]; i < elems.length; i += 1) tab.setAttribute('aria-expanded', false);

      // Hide visible sections
      elems = document.querySelectorAll('aside.off-canvas > section[aria-hidden="false"]');
      for (let i = 0, section = elems[i]; i < elems.length; i += 1) section.setAttribute('aria-hidden', true);

      // Return Canvas state
      const canvasState = document.querySelector('#canvas').dataset;
      if (canvasState.canvasState) canvasState.canvasState = '';

      // Otherwise hide entire menu
      else {
        Util.hide(navigation, true);

        // Allow scrolling
        document.body.classList.remove('noScroll');

        // Remove `expanded` attribute from Toggle
        Util.makeActive(toggle, false);
      }
    } else openMenu();
  },
};

Template.body.events({
  // Canvas Actions
  'click .overlay, click [data-canvas-event="close"]': Canvas.closeSidebars,

  // Mobile Events
  'click [aria-controls][data-toggle="mobile-navigation"]': Canvas.mobileMenu,
});

// Canvas Helpers
Template.canvas.helpers({
  /**
   * @summary Get Google Analytics ID
   * @returns {String}
   */
  gaID: () => {
    if (Settings.ready.get()) return Settings.get('googleAnalyticsId');
    return false;
  },
});

export default Canvas;
