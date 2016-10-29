// Subscriptions
Meteor.subscribe('people');

Template.who.helpers({
  /** Section Title */
  headline: 'Who We Are',

  /** Section Title Subtext */
  content: '<p>WCASA is a membership agency comprised of organizations and <br>individuals working to end sexual violence in Wisconsin. <br>WCASA is made up of it\'s staff, board, volunteers and <br> 51 sexual assault service provider agencies.</p>',

  /**
   * @summary Get subsections from db
   * @function
   * @returns {Object}
   */
  sections: () => {
    const children = Thriver.sections.get(Template.instance().data._id, ['children']).children;
    const tabs = [];

    // Populate tabs in the format desired
    for (let i = 0; i < children.length; i += 1) {
      // If db is not ready, do nothing
      if (!Thriver.sections.get(children[i])) return [];

      tabs.push({
        id: Thriver.sections.get(children[i])._id,
        title: Thriver.sections.get(children[i], ['name']).name,
        content: Thriver.sections.get(children[i], ['data']).data.content || '',
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
  board: () => Thriver.people.collection.find({
    boardMember: true }, { sort: { title: -1, name: 1 } }),
});

Template.staff.helpers({
  staff: () => Thriver.people.collection.find({
    boardMember: false }, { sort: { name: 1 } }),
});

Template.who.events({
  /**
   * @summary Support updating path
   * @method
   *   @param {$.Event} event
   */
  'click a[data-id]': (event) => {
    check(event, $.Event);

    // Get path
    const section = event.target.parentElement.parentElement
      .parentElement.parentElement.parentElement.parentElement;

    const path = `${section.id}/${Thriver.sections.generateId(event.target.textContent)}`;

    // Update history
    Thriver.history.update(section.id, path);
  },
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.who.onRendered(() => {
  // Get db ID from current instance
  const data = Template.instance().data;
  const instanceName = data.name;

  // Register
  Thriver.history.registry.insert({
    element: Thriver.sections.generateId(instanceName),

    /** Handle deep-linking */
    callback: (path) => {
      // Get Sections recursively
      const getChildren = (id) => {
        const sections = {};
        const children = Thriver.sections.get(id, ['children']).children;

        // Get name and ID for each tab
        for (let i = 0; i < children.length; i += 1) {
          // Get section name
          const section = Thriver.sections.get(children[i], ['name']);
          let name = section.name;

          // Then sanitize section name
          name = Thriver.sections.generateId(name);

          // Add to link list and Recurse
          sections[name] = getChildren(children[i]);

          // Add ID to list as well
          sections[name]._id = section._id;
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
