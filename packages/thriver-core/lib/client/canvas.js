// Canvas.js is dedicated to managing canvas events.
// This includes how the canvas/off-canvas elements open/close and relate.
Thriver.canvas = {
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
    for (let i = 0; i < sidebars.length; i += 1) Thriver.util.hide(sidebars[i]);

    // Reset links
    for (let i = 0; i < links.length; i += 1) {
      Thriver.util.makeActive(links[i], false);
      links[i].removeEventListener('click', Thriver.canvas.handleCloseButton);
    }

    // Remove overlay
    Thriver.canvas.removeOverlay();
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
    check(data, Object);
    check(data.element, String);

    // First, close any open sidebars
    Thriver.canvas.closeSidebars();

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
      Thriver.canvas.addOverlay();

      // Make link active
      Thriver.util.makeActive(element);

      // Make sidebar active
      Thriver.util.hide(sidebar, false);

      // Set width
      canvas.dataset.canvasWidth = sidebar.dataset.width;
      canvas.dataset.canvasPosition = sidebar.dataset.position;

      // Bind closure
      element.addEventListener('click', Thriver.canvas.handleCloseButton);
    };

    render();
  },

  /**
   * @summary Handle close button
   * @method
   *   @param {Event|$.Event} event
   */
  handleCloseButton: (event) => {
    check(event, Match.OneOf(Event, $.Event));

    // Prevent anchor link from reopening sidebar while we're trying to close it
    event.stopPropagation();
    event.preventDefault();

    Thriver.canvas.closeSidebars();
  },

  /**
   * @summary Handle opening and closing of mobile hamburger menu
   * @method
   *   @param {$.Event} event
   */
  mobileMenu: (event) => {
    check(event, $.Event);

    // Close menu if it's currently open
    if (event.target.getAttribute('aria-expanded') === 'true') {
      // Hide visible menu items
      document.querySelectorAll('.off-canvas menu.tabs li [aria-expanded="true"]')
        .forEach(tab => tab.setAttribute('aria-expanded', false));

      // Hide visible sections
      document.querySelectorAll('.off-canvas div.tabs article[aria-hidden="false"]')
        .forEach(section => section.setAttribute('aria-hidden', true));

      // Allow scrolling
      document.body.classList.remove('noScroll');

      // Hide menu
      Thriver.util.hide(document.getElementById('mobile-navigation'), true);

      // Remove `expanded` attribute from Toggle
      Thriver.util.makeActive(document.getElementById('mobile-toggle'), false);

      // We're done
      return false;
    }

    // Open menu

    // Set Toggle to Expanded
    Thriver.util.makeActive(document.getElementById('mobile-toggle'), true);

    // Prevent body scrolling
    document.body.classList.add('noScroll');

    // Then make the menu visible
    Thriver.util.hide(document.getElementById('mobile-navigation'), false);

    return false;
  },
};

Template.body.events({
  // Canvas Actions
  'click .overlay, click [data-canvas-event="close"]': Thriver.canvas.closeSidebars,

  // Mobile Events
  'click [aria-controls][data-toggle="mobile-navigation"]': Thriver.canvas.mobileMenu,
});

// Canvas Helpers
Template.canvas.helpers({
  /**
   * @summary Get Google Analytics ID
   * @returns {String}
   */
  gaID: () => Thriver.settings.get('googleAnalyticsId'),
});
