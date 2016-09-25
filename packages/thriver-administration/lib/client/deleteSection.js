// Delete section
Template.sectionAdmin.events({
    /**
     * @summary Delete a section
     * @method
     *   @param {$.Event} event
     */
    'click button.section-delete': function (event) {
        check(event, $.Event);

        event.stopPropagation();
        event.preventDefault();
        
        if (!event.delegateTarget || !event.delegateTarget.dataset)
            return;
        
        // Are you sure??
        if (!confirm('Are you sure you want to delete this section?'))
            return;
        
        var id     = event.delegateTarget.dataset.id,
            link   = document.querySelector('menu [data-id="' + id + '"]'),

        // Get siblings
        elements = event.delegateTarget.parentElement.
            querySelectorAll(':scope > section[data-id]'),
        
        // Start index at the one to delete
        index;
        for (let i = 0; i < elements.length; ++i)
            if (elements[i].dataset.id === id)
                index = i;

        // Call delete method
        if (id)
            Meteor.call('deleteSection', id);

        // And update parent to remove from child list
        if (link && link.dataset.parent)
            Meteor.call('removeChild', link.dataset.parent, id);

        // Update order of remaining sibling elements
        for (; index < elements.length; ++index)
            Meteor.call('updateSectionOrder', elements[index].dataset.id, index);
    }
});
