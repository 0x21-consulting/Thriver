Meteor.methods({
    /**
     * @summary Add an Opportunity
     * @method
     *   @param {String}   id           - MonboDB ID of section to update
     *   @param {Object[]} opportunity  - Opportunity to add
     */
    addOpportunity: function (id, opportunity) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.error('not-authorized');
        
        // Check parameters
        check(id                 , String);
        check(opportunity        , Object);
        check(opportunity.title  , String);
        check(opportunity.content, String);

        // First, ensure the opportunities array already exists
        var data = Thriver.sections.get(id, ['data']).data;

        // Create array if necessary
        if ( !(data.opportunities instanceof Array) )
            data.opportunities = [];
        
        // Generate a random ID
        opportunity.id = Random.id();

        // Add to array
        data.opportunities.push(opportunity);

        // Now update document
        Thriver.sections.collection.update({ _id: id }, { $set: { data: data } });
    },

    /**
     * @summary Delete an Opportunity
     * @method
     *   @param {String} parentID      - ID of Parent element from which to remove opportunity
     *   @param {String} opportunityID - ID of opportunity to remove
     */
    deleteOpportunity: function (parentID, opportunityID) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.error('not-authorized');
        
        // Check parameters
        check(parentID, String);
        check(opportunityID, String);

        // Remove opportunity
        Thriver.sections.collection.update({ _id: parentID }, {
            $pull: {                        // pull
                'data.opportunities': {     // from opportunities array
                    id: opportunityID       // where ID equals opportunityID
                }
            }
        });
    },

    /**
     * @summary Update an Opportunity's content
     * @method
     *   @param {String} parentID      - ID of parent
     *   @param {String} opportunityID - ID of opportunity
     *   @param {String} content       - New content
     */
    updateOpportunityContent: function (parentID, opportunityID, content) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.error('not-authorized');
        
        // Check parameters
        check(parentID     , String);
        check(opportunityID, String);
        check(content      , String);

        // Get parent's data data
        var data = Thriver.sections.get(parentID, ['data']).data.opportunities;

        // Find and remove opportunity from data array
        for (let i = 0; i < data.length; ++i)
            if (data[i].id === opportunityID)
                data[i].content = content;

        // Update opportunity
        Thriver.sections.collection.update({ _id: parentID }, {
            $set: {
                'data.opportunities': data
            }
        });
    },

    /**
     * @summary Update an Opportunity's name
     * @method
     *   @param {String} parentID      - ID of parent
     *   @param {String} opportunityID - ID of opportunity
     *   @param {String} name          - New name
     */
    updateOpportunityName: function (parentID, opportunityID, name) {
        // Check Authorization
        if (!Meteor.userId() || !Meteor.user().admin)
            throw new Meteor.error('not-authorized');
        
        // Check parameters
        check(parentID     , String);
        check(opportunityID, String);
        check(name         , String);

        // Get parent's data data
        var data = Thriver.sections.get(parentID, ['data']).data.opportunities;

        // Find and remove opportunity from data array
        for (let i = 0; i < data.length; ++i)
            if (data[i].id === opportunityID)
                data[i].title = name;

        // Update opportunity
        Thriver.sections.collection.update({ _id: parentID }, {
            $set: {
                'data.opportunities': data
            }
        });
    }
});
