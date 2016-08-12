/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
var handler = function (event) {
    if (! (event instanceof Event) ) return;
    event.stopPropagation();

    if (event.type.toLowerCase() === 'keyup')
        if (event.key.toLowerCase() !== 'enter')
            return;
    
    // Must be enter key, so don't let it happen
    event.preventDefault();

    // Get section ID
    var id = this.parentElement.parentElement.dataset.id;
    
    // Add to db
    Meteor.call('updateSectionName', id, this.textContent);

    // Remove editability
    this.contentEditable = false;
    this.textContent = '';
},

/**
 * Handler for updating section content
 * @method
 *   @param {string} oldContent - Original markdown used for testing
 *                                if there was a change
 */
updateSectionContent = function (oldContent) {
    /**
     * Handler for updating section content
     * @method
     *   @param {Event} event - Click event passed to handler
     */
    return function (event) {
        if (! (event instanceof Event) ) return;
        event.stopPropagation();
        event.preventDefault();

        // Get section ID
        var id = this.parentElement.parentElement.dataset.id,
            newContent = this.parentElement.querySelector('textarea').value;
        
        // Don't commit if nothing changed
        if (newContent !== oldContent) {
            Meteor.call('updateSectionContent', id, newContent);
            location.reload();
        }
        else console.debug('nothing changed');
    };
};

Template.workNav.events({
    /**
     * Add new section
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click li[data-id="new-section"]': function (event) {
        if (! (event instanceof $.Event) ) return;
        event.preventDefault();
        event.stopPropagation();

        var parent = document.querySelector('section.mainSection.work'),
            elems  = parent.querySelectorAll('menu.workNav > ul > li'),

        // Determine index
        index = elems.length;

        Meteor.call('addSection', 'article', index, parent.dataset.id);
    }
});

Template.workContent.events({
    /**
     * Edit section name
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click h2.workContentAdmin': function (event) {
        if (! (event instanceof $.Event) ) return;
        event.preventDefault();
        event.stopPropagation();

        // Make content editable to allow user to change
        event.target.contentEditable = true;

        // On blur or on enter, submit name change
        //event.target.addEventListener('blur',  handler);
        event.target.addEventListener('keyup', handler);
    },
    /**
     * Delete a section
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click header button.delete': function (event) {
        if (! (event instanceof $.Event) ) return;
        event.preventDefault();
        event.stopPropagation();

        // Get work section ID
        var id = event.delegateTarget.parentElement.parentElement.dataset.id;

        // Warn
        if ( !window.confirm('Are you sure you want to delete this section?') )
            return;
        
        // First, remove reference to parent element
        // first parameter is parent ID, second this ID
        Meteor.call('removeChild', id, this.id);

        // Then delete this section
        Meteor.call('deleteSection', this.id);
    },
    /**
     * Edit section markdown
     * @method
     *   @param {$.Event} event - jQuery event handler
     */
    'click header button.edit': function (event) {
        if (! (event instanceof $.Event) ) return;
        event.preventDefault();
        event.stopPropagation();

        // Get section to edit
        var section = event.delegateTarget.querySelector('[data-id="' +
                this.id + '"]'),
            content = section.querySelector('.workTextContainer'),
            parent  = content.parentElement,

        // Create a textarea element through which to edit markdown
        textarea = document.createElement('textarea'),

        // Button by which to okay changes and commit to db
        button = document.createElement('button');
        button.textContent = 'Save';
        button.addEventListener('mouseup', 
            // Pass along original markdown content
            updateSectionContent(content.dataset.markdown));

        // Textarea should get markdown
        textarea.textContent = content.dataset.markdown;

        // Replace section with textarea
        parent.removeChild(content);
        parent.appendChild(textarea);
        parent.appendChild(button);
    }
});