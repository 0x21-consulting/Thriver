// Delete section
Template.sectionAdmin.events({
    // Delete section event handler
    'click button.section-delete': function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        // Call delete method
        Meteor.call('deleteSection', event.delegateTarget.dataset.id);
    }
});