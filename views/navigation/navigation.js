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

/*  Temporarily redirect Providers section link */
Template.navigation.onRendered(() => {
  const providersLink = document.querySelectorAll("#menu a[href='/service-providers']")[0] || undefined;
  if (providersLink !== undefined) {
    providersLink.setAttribute('href', 'https://wcasa.s3.us-east-2.amazonaws.com/resources/SASP+Map+%26+Contacts.pdf');
    providersLink.setAttribute('target', '_blank');
  }
});

export default mainNavigationHelpers;
