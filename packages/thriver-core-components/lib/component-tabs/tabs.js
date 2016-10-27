/**
 * @summary Show page upon menu item click
 * @method
 *   @param {$.Event} event
 */
var toggleTabs = function (event) {
	check(event, $.Event);

	event.preventDefault();

	// Tabs Variables
	var menu     = event.target.parentNode.parentNode,
		links    = menu.querySelectorAll('[aria-controls][data-toggle=tabs]'),
		sections = menu.parentNode.querySelectorAll('div.tabs [aria-hidden]');

	// Remove active state from all links
	for (let i = 0; i < links.length; ++i)
		Thriver.util.makeActive(links[i], false);

	// Hide all sections
	for (let i = 0; i < sections.length; ++i)
		Thriver.util.hide(sections[i], true);

    // Set link as active
    Thriver.util.makeActive(event.target, true);

    // Set section as active
    Thriver.util.hide( menu.parentElement.querySelector('article[data-id="' +
        event.target.dataset.id + '"]'), false);

    // Special case for Library??  Why??
    switch ( event.target.getAttribute('aria-controls') ) {
        case '#library':
            document.querySelector('aside.filter').classList.add('active-filter'); break;
        default:
            document.querySelector('aside.filter').classList.remove('active-filter');
    }
};

Template.body.events({
    //Tabs
    'click [data-toggle=tabs]': toggleTabs
});

/**
 * @summary On Render, click first menu item
 * @method
 */
Template.tabs.onRendered(function () {

    //Deselect all active tabs if on mobile
    if (window.innerWidth < 768){

        // Tabs vars
        var tabAnchors = document.querySelectorAll('menu.tabs > li > a'),
            tabs       = document.querySelectorAll('div.tabs > article');

        // Remove expanded from all tab anchors
        for (let i = 0; i < tabAnchors.length; ++i)
            Thriver.util.makeActive(tabAnchors[i], false);

        // Add hidden state to all tabs
        for (let i = 0; i < tabs.length; ++i)
            Thriver.util.hide(tabs[i], true);

    }

    // I don't believe this is doing anything'
	var toggleMenus;

	if (window.innerWidth > 767)
		toggleMenus = document.querySelectorAll('menu.tabs');
	if (window.innerWidth < 768)
		toggleMenus = document.querySelectorAll('#main #masthead menu.tabs');

	// For each toggle menu, select the first one
	//for (let i = 0; i < toggleMenus.length; ++i)
	//	toggleMenus[i].querySelector('[data-toggle="tabs"]').click();
});

/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
var handler = function (event) {
    var id, name;

    check(event, Event);
    event.stopPropagation();

    if (event.which)
        if (event.which === 13) {
            this.blur();
            return false;
        } else return;

    // Get section ID
    id = this.parentElement.dataset.id;
    name = this.textContent;

    // Remove editability
    this.contentEditable = false;

    // Add to db
    if ( this.dataset.hash !== SHA256(name) ) {
        this.textContent = '';
        Meteor.call('updateSectionName', id, name);
    }
},

/**
 * Handler for updating section content
 * @method
 *   @param {string} oldHash - SHA256 hash of original markdown
 *     to detect if there was a change
 */
updateSectionContent = function (oldHash) {
    check(oldHash, String);

    /**
     * Handler for updating section content
     * @method
     *   @param {Event} event - Click event passed to handler
     */
    return function (event) {
        check(event, Event);

        event.stopPropagation();
        event.preventDefault();

        var parent = event.target.parentElement, element,

        // Get section ID
        id = parent.dataset.id,
		content = parent.querySelector('textarea').value,
		newHash = SHA256(content);

        // Don't commit if nothing changed
        if (newHash !== oldHash)
            Meteor.call('updateSectionData', id, { content: content });

        // Restore view
        parent.classList.remove('edit');
        parent.querySelector('textarea').remove();
        parent.querySelector(':scope > button').remove();
    };
};

// Administrative bindings
Template.tabs.events({
    /**
     * @summary Add a list item
     * @method
     *   @param {$.Event} event
     */
    'click [editable!="false"] button.add': function (event) {
        check(event, $.Event);

        event.preventDefault();

        var id = event.target.parentElement.parentElement.dataset.id;

        Meteor.call('addOpportunity', id, {
            title: 'New Opportunity',
            content: ''
        });
    },

    /**
     * Edit section name
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click [editable!="false"] h2': function (event) {
        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();

        // Make content editable to allow user to change
        event.target.contentEditable = true;

        // Calculate SHA hash to detect whether a change was made
        event.target.dataset.hash = SHA256(event.target.textContent);

        // On blur or on enter, submit name change
        event.target.addEventListener('blur',  handler);
        event.target.addEventListener('keypress', handler);
    },

    /**
     * Delete a section
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click div.tabs > article[editable!="false"] > aside.admin > button.delete': function (event) {
        var link, parent;

        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();

        // Get Nav link
        link = event.delegateTarget.parentElement.querySelector('menu [data-id="'
            + this.id + '"]').parentElement.parentElement;

        // If the nav link has a parent with an ID, this is a tab
        if (link.dataset.id)
            parent = link.dataset.id;
        else
            // Otherwise parent is just the work section
            parent = event.delegateTarget.parentElement.parentElement.dataset.id;

        // Warn
        if ( !window.confirm('Are you sure you want to delete this section?') )
            return;

        // First, remove reference to parent element
        // first parameter is parent ID, second this ID
        Meteor.call('removeChild', parent, this.id);

        // Then delete this section
        Meteor.call('deleteSection', this.id);
    },

    /**
     * Edit section markdown
     * @method
     *   @param {$.Event} event - jQuery event handler
     */
    'click [editable!="false"] button.edit': function (event) {
        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();

        // Get section to edit
        var section = event.delegateTarget.querySelector('article[aria-hidden="false"]'),
            content = section.querySelector(':scope section'),
            parent  = content.parentElement,

        // Create a textarea element through which to edit markdown
        textarea = document.createElement('textarea'),

        // Button by which to okay changes and commit to db
        button = document.createElement('button');
        button.textContent = 'Save';
        button.addEventListener('mouseup',
            // Pass along hash of existing markdown
            updateSectionContent(content.dataset.hash));

        // Textarea should get markdown
        textarea.textContent = Thriver.sections.get(this.id, ['data']).data.content;

        // Add textarea but hide preview
        parent.classList.add('edit');
        parent.appendChild(textarea);
        parent.appendChild(button);
    }
});
