/**
 * @summary Navigation Template helpers
 * @namespace
 */
Thriver.mainNavigationHelpers = {
  /**
   * @summary Get all relevant section information for producing
   *   the top-level navigation
   * @function
   * @returns {LocalCollection.Cursor}
   */
  sections: () =>
    // Get all sections that should appear on the page
    // and which have a name set
    Thriver.sections.collection.find({
      displayOnPage: true,
      name: { $ne: null },
    }, {
      // Filter to only include relevant information
      fields: { name: 1 },
      sort: { order: 1 },
    }),
};

Template.navigation.helpers(Thriver.mainNavigationHelpers);
