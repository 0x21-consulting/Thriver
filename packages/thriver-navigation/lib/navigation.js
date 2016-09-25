/**
 * @summary Navigation Template helpers
 * @namespace
 */
mainNavigationHelpers = {
    /**
     * @summary Get all relevant section information for producing
     *   the top-level navigation
     * @function
     * @returns {LocalCollection.Cursor}
     */
    sections: function () {
        // Get all sections that should appear on the page
        // and which have a name set
        return sections = Thriver.sections.collection.find({
            displayOnPage: true,
            name         : { $ne: null }
        }, {
            // Filter to only include relevant information
            fields: { name: 1 },
            sort  : { order: 1 }
        });
    }
};

Template.navigation.helpers(mainNavigationHelpers);

// Smooth scroll
Template.navigation.events({ 'click a' : Thriver.history.smoothScrollEventHandler });
