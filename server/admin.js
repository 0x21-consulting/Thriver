Meteor.methods({
    isAdmin: function () {
        // Return whether or not the logged-in user is an administrator
        return Meteor.user()? Meteor.user().admin : false;
    },
    //
    // Section-related methods
    //
    // Add new section
    addSection: function (template, order) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        template = '' + template;
        order = parseInt(order);
        
        // Add new section
        Sections.insert({
            name: null,
            content: null,
            template: template,
            order: order,
            displayOnPage: true,
            tabs: []
        });
    },
    
    // Update section order
    updateOrder: function (id, order) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        id = '' + id;
        order = parseInt(order);
        
        // Update order
        Sections.update({ '_id': id }, {
            $set: { 'order': order }
        });
    },
    
    // Delete a section
    deleteSection: function (id) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        id = '' + id;
        
        // Delete section
        Sections.remove({ '_id': id });
    },
    
    // Update a section's name and anchor
    updateSection: function (id, name) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        id = '' + id;
        name = '' + name;
        
        // Update section
        Sections.update({ '_id': id }, {
            $set: {
                name: name
            }
        });
    }
});