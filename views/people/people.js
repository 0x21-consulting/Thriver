import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import ProvidersCount from '/views/providers/providers';
import Sections from '/logic/sections/sections';
import People from '/logic/people/schema';
import History from '/views/history/history';

import './people.html';
import './admin';

// Subscriptions
Meteor.subscribe('people');

Template.who.helpers({
  /** Section Title */
  headline: 'Who We Are',

  /** Count of total service providers */
  count: () => ProvidersCount.get(),

  /**
   * @summary Get subsections from db
   * @function
   * @returns {Object}
   */
  sections: () => {
    const { children } = Sections
      .get(Template.instance().data._id, ['children']);
    const tabs = [];

    // Populate tabs in the format desired
    for (let i = 0; i < children.length; i += 1) {
      // If db is not ready, do nothing
      if (!Sections.get(children[i])) return [];

      tabs.push({
        id: Sections.get(children[i])._id,
        title: Sections.get(children[i], ['name']).name,
        content: Sections.get(children[i], ['data']).data.content || '',
        template: 'generic',
        editable: true,
        isFirst: i === 0,
      });
    }

    // Push Staff and board details
    tabs.push({
      title: 'WCASA Staff',
      icon: '&#xf0c0;',
      id: 'staff',
      template: 'staff',
      editable: false,
      isFirst: children.length === 0,
    }, {
      title: 'Board of Directors',
      icon: '&#xf0c0;',
      id: 'board',
      template: 'board',
      editable: false,
    });

    return [{
      class: 'left',
      showAddPage: true,
      tabs,
    }];
  },
});

Template.board.helpers({
  board: () => People.collection
    .find({ boardMember: true }, { sort: { title: -1, name: 1 } }),

  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  people: () => People.collection,
});

Template.staff.helpers({
  staff: () => People.collection
    .find({ boardMember: false }, { sort: { name: 1 } }),

  /**
   * @summary The collection to use to populate form
   * @function
   * @returns {Mongo.Collection}
   */
  people: () => People.collection,
});

Template.who.events({
  /**
   * @summary Support updating path
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    // Get path
    const section = event.target.parentElement.parentElement
      .parentElement.parentElement.parentElement.parentElement;

    const path = `${section.id}/${Sections.generateId(event.target.textContent)}`;

    // Update history
    History.update(section.id, path);
  },
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.who.onRendered(() => {
  // Get db ID from current instance
  const data = Template.currentData();
  const instanceName = data.name;

  // History can't work unless the section has a name
  if (!data.name) return;

  // Register
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

      // If there's no path, there's nothing to do
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
});
