/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
var handler = function (event) {
    var opportunity, opportunityID, parentID, name;

    check(event, Event);
    event.stopPropagation();

    if (event.which)
        if (event.which === 13) {
            this.blur();
            return false;
        } else return;

    // Get section IDs
    opportunity   = this.parentElement.parentElement.parentElement.parentElement.parentElement;
    opportunityID = opportunity.dataset.id;
    parentID      = opportunity.parentElement.parentElement.parentElement.dataset.id;
    name = this.textContent;
    
    // Remove editability
    this.contentEditable = false;

    // Add to db
    if ( this.dataset.hash !== SHA256(name) ) {
        this.textContent = '';
        Meteor.call('updateOpportunityName', parentID, opportunityID, name);
    }
},

/**
 * Handler for updating section content
 * @method
 *   @param {string} oldHash       - SHA256 hash of original markdown
 *   @param {string} parentID      - ID of parent element
 *   @param {string} opportunityID - ID of opportunity to modify
 *     to detect if there was a change
 */
updateSectionContent = function (oldHash, parentID, opportunityID) {
    check(oldHash, String);
    check(parentID, String);
    check(opportunityID, String);

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
		content = parent.querySelector('textarea').value,
		newHash = SHA256(content);
        
        // Don't commit if nothing changed
        if (newHash !== oldHash)
            Meteor.call('updateOpportunityContent', parentID, opportunityID, content);

        // Restore view
        parent.classList.remove('edit');
        parent.querySelector('textarea').remove();
        parent.querySelector(':scope > button').remove();
    };
};

Template.list.events({
    /**
     * @summary Delete an opportunity
     * @method
     *   @param {$.Event} event
     */
    'click aside.admin button.oppDelete': function (event) {
        check(event, $.Event);

        var id = event.delegateTarget.parentElement.dataset.id;

        if ( confirm('Are you sure you want to delete this opportunity?') )
            Meteor.call('deleteOpportunity', id, this.id);
    },

    /**
     * @summary Edit opportunity content
     * @method
     *   @param {$.Event} event
     */
    'click aside.admin button.oppEdit': function (event) {
        check(event, $.Event);

        // Get section to Edit
        var section  = event.delegateTarget.querySelector('article[data-id="' + this.id + '"]'),
            content  = section.querySelector('div.inner'),
            parent   = content.parentElement,
            parentID = event.delegateTarget.parentElement.dataset.id,
            data     = Thriver.sections.get(parentID, ['data']).data.opportunities,

        // Create a textarea element through which to edit markdown
        textarea = document.createElement('textarea'),

        // Button by which to okay changes and commit to db
        button = document.createElement('button');
        button.textContent = 'Save';
        button.addEventListener('mouseup',
            updateSectionContent( SHA256(this.content), parentID, this.id) );

        // Textarea should get markdown
        for (let i = 0; i < data.length; ++i)
            if (data[i].id === this.id)
                textarea.textContent = data[i].content;

        // Add textarea but hide preview
        parent.classList.add('edit');
        parent.appendChild(textarea);
        parent.appendChild(button);
    },

    /**
     * @summary Edit opportunity name
     * @method
     *   @param {$.Event} event
     */
    'click details article a > h3': function (event) {
        check(event, $.Event);

        // Make content editable to allow user to change
        event.target.contentEditable = true;

        // Calculate SHA hash to detect whether a change was made
        event.target.dataset.hash = SHA256(event.target.textContent);

        // On blur or on enter, submit name change
        event.target.addEventListener('blur',  handler);
        event.target.addEventListener('keypress', handler);
    }
});
