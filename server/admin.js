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
    updateSectionOrder: function (id, order) {
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
    updateSectionName: function (id, name) {
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
    },
    
    // Update a section's content
    updateSectionContent: function (id, content) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        id = '' + id;
        content = '' + content;
        
        // Update section
        Sections.update({ '_id': id}, {
            $set: {
                content: content
            }
        });
    },
    
    //
    // Tab-related methods
    //
    
    // Add a new tab
    addTab: function (id, order) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
            
        // Mutual Suspicion
        id = '' + id;
        order = parseInt(order);
        
        // Add tab
        Sections.insert({
            name: null,
            content: null,
            template: null,
            order: order,
            displayOnPage: false,
            tabs: []
        },
        // Update parent section to include the tab
        function (error, tabId) {
            if (error) throw new Meteor.Error(error);
            Sections.update({ '_id': id}, {
                $addToSet: {
                    tabs: tabId
                }
            });
        });
    },
    
    // Update tab order
    updateTabOrder: function (id, order) {
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
    
    // Update tab name
    updateTabName: function (id, name) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        id = '' + id;
        name = '' + name;
        
        // Update tab name
        Sections.update({ '_id': id }, {
            $set: { 'name': name }
        });
    }
});