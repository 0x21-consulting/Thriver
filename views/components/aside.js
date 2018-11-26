import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import History from '/views/history/history';
import Sections from '/logic/sections/sections';
import Canvas from '/views/canvas/canvas';

import './aside.html';

// Populate Profile tab under Account Overview
Template.aside.helpers({
  items: [{
    title: 'Account Details',
    icon: 'user',
    id: 'account', // Sets the ID of the sidebar which gets targeted by utility nav items
    width: 700, // Sets the sidebar width & body class
    position: 'left', // Which Direction the sidebar appears from
    class: 'top', // Style. accepts 'left' and 'top'
    tabs: [{ // If sidebar has tabs: use this property
      title: 'Profile',
      icon: 'user',
      id: 'profile',
      template: 'profile',
    }, {
      title: 'Events',
      icon: 'cal',
      id: 'events',
      template: 'eventsRegistered',
    }, {
      title: 'Subscriptions',
      icon: 'envelope',
      id: 'subscriptions',
      template: 'subscriptions',
    }, {
      title: 'Receipts',
      icon: 'cal',
      id: 'receipts',
      template: 'receiptsList',
    }, {
      title: 'Preferences',
      icon: 'gear',
      id: 'preferences',
      template: 'preferences',
    }],
  }, {
    title: 'Notifications',
    icon: 'bell',
    id: 'notifications',
    width: 356,
    position: 'left',
    template: 'notifications',
  }, {
    title: 'Account Sign in',
    id: 'sign-in',
    width: 356,
    position: 'left',
    template: 'signin',
  }, {
    title: 'Create an Account',
    id: 'register',
    width: 500,
    position: 'left',
    template: 'register',
  }, {
    title: 'Twitter',
    icon: 'twitter',
    id: 'twitter',
    width: 356,
    position: 'right',
    template: 'twitter',
  }, {
    title: 'Resource Center',
    icon: 'institution',
    id: 'resource-center',
    width: 700,
    position: 'right',
    filter: 'true',
    filterId: 'searchLC',
    class: 'top',
    subhead: 'lcSubHead',
    tabs: [{
      title: 'Infosheets',
      id: 'infosheets',
      template: 'infosheets',
    }, {
      title: 'Webinars',
      id: 'webinars',
      template: 'webinars',
    }, {
      title: 'Library',
      id: 'library',
      template: 'library',
    }, {
      title: 'Data',
      id: 'data',
      template: 'resourceData',
    }],
  }, {
    title: 'News',
    icon: 'news',
    id: 'news',
    width: 700,
    position: 'right',
    filter: 'true',
    filterId: 'searchNews',
    class: 'top',
    subhead: 'newsSubHead', // header subtemplate
    tabs: [{ // If sidebar has tabs: use this property
      title: 'In the News',
      id: 'in-the-news',
      template: 'inTheNews',
    }, {
      title: 'Press Releases',
      id: 'press-releases',
      template: 'press',
    }, {
      title: 'Action Alerts',
      id: 'action-alerts',
      template: 'actionAlerts',
    }],
  }, {
    title: 'Donate to WCASA',
    icon: 'heart',
    id: 'donate',
    width: 700,
    position: 'right',
    template: 'donate',
  }, {
    title: 'Event Registration',
    icon: 'ticket',
    id: 'payments',
    width: 700,
    position: 'right',
    template: 'payments',
  }, {
    title: 'Privacy Policy',
    icon: 'eye',
    id: 'legal-privacy-policy',
    width: 700,
    position: 'right',
    template: 'legal-privacy-policy',
  }, {
    title: '¡Bienvenidos a la página web en Español de WCASA!',
    icon: 'flag',
    id: 'espanol',
    width: 700,
    position: 'right',
    subhead: 'espanolSubhead',
    tabs: [{ // If sidebar has tabs: use this property
      title: 'Servicios Bilingües',
      id: 'espanolServiciosBilingues',
      template: 'espanolServiciosBilingues',
    }, {
      title: 'Recursos',
      id: 'espanolRecursos',
      template: 'espanolRecursos',
    }],
  }],
});

Template.aside.events({
  /**
   * @summary Support updating path
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    // Get path
    const section = event.target.parentElement.parentElement.parentElement
      .parentElement.parentElement;

    const path = `${section.id}/${Sections.generateId(event.target.textContent)}`;

    // Update history
    History.update(section.id, path);
  },
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.aside.onRendered(() => {
  // Remember aside
  const aside = Template.instance().firstNode;
  const sidebars = aside.querySelectorAll('section.sidebar');

  /**
   * @summary Callback for Deep-linking
   * @method
   *   @param {String[]} path
   */
  const deepLinkCallback = (path) => {
    // Wait for element to exist
    const render = () => {
      const section = aside.querySelector('section[aria-hidden="false"]');

      if (!(section instanceof Element)) {
        Meteor.defer(render);
        return;
      }

      const { id } = section;
      const tabs = document.querySelectorAll(`#${id} menu.tabs > li > a`);

      // Find tab, then click it
      for (let i = 0; i < tabs.length; i += 1) {
        if (path[0] === tabs[i].dataset.id) tabs[i].click();
      }

      // Otherwise, if there isn't any path, click the first tab for the user
      if (!path.length && tabs.length) {
        if (window.screen.width > 767) tabs[0].click();
      }
    };

    render();
  };

  // Register each tab
  for (let i = 0; i < sidebars.length; i += 1) {
    History.registry.insert({
      element: sidebars[i].id,
      accessData: {
        element: `a[aria-controls="${sidebars[i].id}"]`,
      },
      accessFunction: Canvas.openSidebar,

      /** Handle deep-linking */
      callback: deepLinkCallback,
    });
  }
});
