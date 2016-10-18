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
    id = this.parentElement.parentElement.dataset.id;
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

        var parent = event.target.parentElement, element;

        // Get section ID
        var id = this.parentElement.parentElement.dataset.id,
            content = this.parentElement.querySelector('textarea').value,
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

Template.workNav.events({
    /**
     * Add new section
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click li.new-section a': function (event) {
        var parent;

        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();

        // Get arbitrary parent element
        parent = event.target.parentElement.parentElement.parentElement;

        // If this parent element has an ID, this is a sub page
        if (parent.dataset.id) {
            parent = parent;
            elems  = parent.querySelectorAll('li[data-id]');
        } else {
            // Top-level page; get ID for work section
            parent = event.delegateTarget.parentElement.parentElement;
            elems  = parent.querySelectorAll('menu.workNav > ul > li[data-id]');
        }

        // Determine index
        index = elems.length;

        Meteor.call('addSection', 'article', index, parent.dataset.id, 'Unnamed Page',
            function (error, id) {
                Template.workListItem.onRendered(function () {
                    // Let's be helpful and navigate to the new page
                    var link = document.querySelector('li[data-id="' + id + '"] > a');
                    link.click();
                });
            });
    }
});

Template.workContent.events({
    /**
     * Edit section name
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click h2.workContentAdmin': function (event) {
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
    'click header button.delete': function (event) {
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
    'click header button.edit': function (event) {
        check(event, $.Event);

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

// About SA events
Template.aboutSA.events({
    /**
     * @summary Edit Section markdown
     * @method
     *   @param {$.Event} event
     */
    'click button.edit': function (event) {
        check(event, $.Event);

        var section = event.target.parentElement.querySelector('section > section'),
            parent  = section.parentElement,
            that    = this,
    
        // Create a textarea element through which to edit markdown
        textarea = document.createElement('textarea'),

        // Button by which to okay changes and commit to db
        button = document.createElement('button');
        button.textContent = 'Save';
        button.addEventListener('mouseup', function (event) {
            check(event, Event);

            var parent = event.target.parentElement, element;

            // Get section ID
            var id = that._id,
                content = this.parentElement.querySelector('textarea').value,
                newHash = SHA256(content);
            
            // Don't commit if nothing changed
            if (newHash !== section.dataset.hash)
                Meteor.call('updateSectionData', id, { aboutSA: content });

            // Restore view
            parent.parentElement.classList.remove('edit');
            parent.querySelector('textarea').remove();
            parent.querySelector(':scope > button').remove();
        });
        
        // Textarea should get markdown
        textarea.textContent = Thriver.sections.get(this._id, ['data']).data.aboutSA;

        // Add textarea but hide preview
        parent.parentElement.classList.add('edit');
        parent.appendChild(textarea);
        parent.appendChild(button);
    }
});
