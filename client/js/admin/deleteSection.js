// Delete section
Template.sectionAdmin.events({
    // Delete section event handler
    'click button.section-delete': function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        if (!event || !event.delegateTarget || !event.delegateTarget.dataset)
            return;
        
        // Are you sure??
        if (!confirm('Are you sure you want to delete this section?'))
            return;
        
        var id     = event.delegateTarget.dataset.id,
            link   = document.querySelector('menu [data-id="' + id + '"]');
        
        // Call delete method
        if (id)
            Meteor.call('deleteSection', id);
        
        // And update parent to remove from child list
        if (link && link.dataset.parent)
            Meteor.call('removeChild', link.dataset.parent, id);
    }
});