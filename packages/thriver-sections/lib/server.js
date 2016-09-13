/**
 * @summary Publish Sections data from Mongo sections collection
 * @function
 *   @param {String} id - ID of section to get children sections
 */
Meteor.publish('sections', function (id) {
    var tabs;
    
    // id must be either a String or undefined
    check(id, Match.Maybe(String));
    
    if (id)
        return Thriver.sections.get(id);
    
    // Otherwise return all sections
    return Thriver.sections.collection.find();
});

Meteor.methods({
    /**
     * Add new section
     * @method
     *   @param {string} template - Name of template to apply to section
     *   @param {number} index    - The index of the section relative to its siblings
     *   @param {string} parent   - The ID of a section's parent (optional)
     *   @param {string} name     - Initial section name (optional)
     */
    addSection: function (template, index, parent, name, callback) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Parameter checks
        check(template, String);
        check(index,    Number);
        check(parent,   Match.Maybe(String) );
        check(name,     Match.Maybe(String) );
        
        // Add new section
        return Thriver.sections.collection.insert({
            name         : name || null,
            icon         : '\uf0e9',  // default icon: umbrella
            content      : null,
            template     : template,
            order        : index,
            displayOnPage: parent? false : true,
            tabs         : []
        },
        // Update parent section, if there is one, to include section
        function (error, id) {
            if (error) throw new Meteor.Error(error);
            
            // If no parent, do nothing
            if (!parent) 
                return;
            
            // Update parent element to include new child
            Thriver.sections.collection.update({ '_id': parent }, {
                $addToSet: {
                    tabs: id
                }
            });
        });
    },
    
    /**
     * Update section order
     * @method
     *   @param {string} sectionId - ID of section to update
     *   @param {number} newIndex  - New index location of section
     */
    updateSectionOrder: function (sectionId, newIndex) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Mutual Suspicion
        sectionId = '' + sectionId;
        newIndex  = parseInt(newIndex);
        
        // Update order
        Thriver.sections.collection.update({ '_id': sectionId }, {
            $set: { 'order': newIndex }
        });
    },
    
    /**
     * Delete a section
     * @method
     *   @param {string} id - The ID of the section to delete
     */
    deleteSection: function (id) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        var tabs, i, j;
        
        // Parameter check
        check(id, String);
        
        // Delete any tabs
        tabs = Thriver.sections.collection.findOne({ '_id': id }, { tabs: 1 });
        if (tabs && tabs.tabs instanceof Array) {
            tabs = tabs.tabs;
            
            // Remove each tab, one at a time
            for (i = 0, j = tabs.length; i < j; ++i) {
                Thriver.sections.collection.remove({ '_id': tabs[i] });
            }
        }
        
        // Delete section
        Thriver.sections.collection.remove({ '_id': id });
    },
    
    /**
     * Update a section's name and anchor
     * @method
     *   @param {string} id   - MongoDB ID of section to update
     *   @param {string} name - Name to change to
     */
    updateSectionName: function (id, name) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Parameter checks
        check(id, String);
        check(name, String);
        
        // Update section
        Thriver.sections.collection.update({ '_id': id }, {
            $set: {
                name: name
            }
        });
    },
    
    /**
     * Update a section's content
     * @method
     *   @param {string} id      - MongoDB ID of section to update
     *   @param {string} content - New content to replace
     */
    updateSectionContent: function (id, content) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Check parameters
        check(id, String);
        check(content, String);
        
        // Update section
        Thriver.sections.collection.update({ '_id': id }, {
            $set: {
                content: content
            }
        });
    },
    
    /**
     * Remove an ID from list of children
     * @method
     *   @param {string} id    - ID of element to modify
     *   @param {string} child - ID of child to remove from list
     */
    removeChild: function (id, child) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.Error('not-authorized');
        
        // Parameter checks
        check(id,    String);
        check(child, String);
        
        // Update list to remove child
        Thriver.sections.collection.update({ '_id': id }, {
            $pull: {
                tabs: child
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
        Thriver.sections.collection.insert({
            name: null,
            icon: '\uf0e9',               // use default (umbrella)
            content: null,
            template: null,
            order: order,
            displayOnPage: false,
            tabs: []
        },
        // Update parent section to include the tab
        function (error, tabId) {
            if (error) throw new Meteor.Error(error);
            Thriver.sections.collection.update({ '_id': id}, {
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
        console.log('id ' + id);
        console.log('order ' + order);
        // Update order
        Thriver.sections.collection.update({ '_id': id }, {
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
        Thriver.sections.collection.update({ '_id': id }, {
            $set: { 'name': name }
        });
    }
});
