import { Template } from 'meteor/templating';
import Sections from '/logic/sections/sections';
import History from '/views/history/history';

import './outreach.html';

Template.outreach.helpers({
  /** Section Title */
  headline: 'Get Involved',

  /** Section Title Subtext */
  content: '<p>We believe that everyone has a role and a responsibility <br>in this work. WCASA is always seeking passionate folks<br>to join up and help make a difference.<br><button class="action-alert-link">See Action Alerts <span class="fa">&#xf0da;</span></button></p>',

  /**
   * @summary Get subsections from db
   * @function
   * @returns {Object}
   */
  sections: (data) => {
    const { children } = Sections.get(data._id, ['children']);
    const tabs = [];

    // Populate tabs in the format desired
    for (let i = 0; i < children.length; i += 1) {
      // If db is not ready, do nothing
      if (!Sections.get(children[i])) return [];

      tabs.push({
        id: Sections.get(children[i])._id,
        title: Sections.get(children[i], ['name']).name,
        content: Sections.get(children[i], ['data']).data.content || '',
        lists: [{
          type: 'article',
          itemType: 'category',
          style: 'stripped',
          categories: Sections.get(children[i], ['data']).data.opportunities || [],
        }],
        template: 'generic',
        editable: true,
        addable: true,
        isFirst: i === 0,
      });
    }

    return [{
      class: 'left',
      showAddPage: true,
      tabs,
    }];
  },
});

Template.outreach.events({
  /**
   * @summary Support updating path
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    const section = event.target.parentElement.parentElement
      .parentElement.parentElement.parentElement.parentElement;

    // Get path
    const path = `${section.id}/${Sections.generateId(event.target.textContent)}`;

    // Update history
    History.update(section.id, path);
  },
  /**
   * @summary Action Alerts button
   * @method
   *   @param {$.Event} event
   */
  'click .action-alert-link': () => History.navigate('/news/action-alerts'),
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.outreach.onRendered(() => {
  // Get db ID from current instance
  const data = Template.currentData();
  const instanceName = data.name;

  // Register
  if (instanceName) {
    History.registry.insert({
      element: Sections.generateId(instanceName),

      /** Handle deep-linking */
      callback: (path) => {
        // Get Sections recursively
        const getChildren = (id) => {
          const sections = {};
          const { children } = Sections.get(id, ['children']);

          // Get name and ID for each tab
          for (let i = 0; i < children.length; i += 1) {
            // Get section name
            const section = Sections.get(children[i], ['name']);

            if (section) {
              let { name } = section;

              // Then sanitize section name
              name = Sections.generateId(name);

              // Add to link list and Recurse
              sections[name] = getChildren(children[i]);

              // Add ID to list as well
              sections[name]._id = section._id;
            }
          }

          return sections;
        };

        // If there's no path, do nothing
        if (!path.length) return;

        // Get link list of all browseable sections
        let sections = getChildren(data._id);

        // Also add static Staff and Board sections
        sections['wcasa-staff'] = { _id: 'staff' };
        sections['board-of-directors'] = { _id: 'board' };

        // Get link for deep-linked section
        for (let i = 0; i < path.length; i += 1) {
          if (sections[path[i]]) sections = sections[path[i]];
          else break;
        }

        // Find anchor element
        const link = document.querySelector(`a[data-id="${sections._id}"]`);

        // Click anchor to activate page
        if (link instanceof Element) link.click();
      },
    });
  }
});
