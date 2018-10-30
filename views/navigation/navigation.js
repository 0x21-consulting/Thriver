import { Template } from 'meteor/templating';
import Sections from '/logic/sections/sections';

import './main.html';
import './mobile';
import './utility';

/**
 * @summary Navigation Template helpers
 * @namespace
 */
const mainNavigationHelpers = {
  /**
   * @summary Get all relevant section information for producing
   *   the top-level navigation
   * @function
   * @returns {LocalCollection.Cursor}
   */
  sections: () => Sections.collection.find({
    // Get all sections that should appear on the page
    // and which have a name set
    displayOnPage: true,
    name: { $ne: null },
  }, {
    // Filter to only include relevant information
    fields: { name: 1 },
    sort: { order: 1 },
  }),
};

Template.navigation.helpers(mainNavigationHelpers);

export default mainNavigationHelpers;
