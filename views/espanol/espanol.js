import { Template } from 'meteor/templating';

import './espanol.html';
import './helpers';

// Events
Template.espanolMas.events({
  /**
   * @summary Load More
   * @method
   *   @param {$.Event} event
   */
  'click #news li.loadMore button': () => {
  },
});
