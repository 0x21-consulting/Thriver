// Subscriptions
var People = new Mongo.Collection('people');
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
    sections: function () {
        var children = Thriver.sections.get(this._id, ['children']).children,
            tabs = [];
        
        // Populate tabs in the format desired
        for (let i = 0; i < children.length; ++i) {
            // If db is not ready, do nothing
            if (!Thriver.sections.get(children[i])) return;

            tabs.push({
                id      : Thriver.sections.get(children[i])._id,
                title   : Thriver.sections.get(children[i], ['name']).name,
                content : Thriver.sections.get(children[i], ['data']).data.content || '',
                template: 'generic',
                editable: true,
                isFirst: i === 0? true : false
            });
        }

        // Push Staff and board details
        tabs.push({
            title: 'WCASA Staff',
            icon: '&#xf0c0;',
            id: 'staff',
            template: 'staff',
            editable: false
        },{
            title: 'Board of Directors',
            icon: '&#xf0c0;',
            id: 'board',
            template: 'board',
            editable: false
        });

        return [{
            class: 'left',
            showAddPage: true,
            tabs: tabs
        }];
    }
});

Template.board.helpers({
    board: function () {
        return People.find({ boardMember: true }, { sort: { title: -1, name: 1 }});
    }
});

Template.staff.helpers({
    staff: function () {
        return People.find({ boardMember: false }, { sort: { name: 1 }});
    }
});

Template.who.events({
    /**
     * @summary Support updating path
     * @method
     *   @param {$.Event} event
     */
    'click a[data-id]': function (event) {
        check(event, $.Event);

        // Get path
        var section = event.target.parentElement.parentElement.
                parentElement.parentElement.parentElement,
            path    = section.id + '/' + Thriver.sections.generateId(event.target.textContent);

        // Update history
        Thriver.history.update(section.id, path);
    }
});

/**
 * @summary Register Deep-linking
 * @method
 */
Template.who.onRendered(function () {
    // Get db ID from current instance
    var instanceName = this.data.name,
        data = this.data;

    // Register
    Thriver.history.registry.insert({
        element: Thriver.sections.generateId(instanceName),
        /** Handle deep-linking */
        callback: function (path) {
            var sections, section, i, j, link,

            // Get Sections recursively
            getChildren = function (id) {
                var sections = {}, section,
                    children  = Thriver.sections.get(id, ['children']).children,
                    name, i, j;

                // Get name and ID for each tab
                for (i = 0, j = children.length; i < j; ++i) {
                    // Get section name
                    section = Thriver.sections.get( children[i], ['name'] );
                    name = section.name;

                    // Then sanitize section name
                    name = Thriver.sections.generateId(name);

                    // Add to link list and Recurse
                    sections[ name ] = getChildren( children[i] );

                    // Add ID to list as well
                    sections[ name ]._id = section._id;
                }

                return sections;
            };

            // If there's no path, there's nothing to do
            if (!path.length) return;

            // Get link list of all browseable sections
            sections = getChildren(data._id);

            // Also add static Staff and Board sections
            sections['wcasa-staff']        = { _id: 'staff' };
            sections['board-of-directors'] = { _id: 'board' };

            // Get link for deep-linked section
            for (i = 0, j = path.length; i < j; ++i) {
                if (sections[ path[i] ])
                    sections = sections[ path[i] ];
                else break;
            }

            // Find anchor element
            link = document.querySelector('a[data-id="' + sections._id + '"]');

            // Click anchor to activate page
            if (link instanceof Element)
                link.click();

            console.debug('Deep-link:', path, data, sections);
        }
    });
});
