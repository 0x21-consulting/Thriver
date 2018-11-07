import { Template } from 'meteor/templating';

// Spacebars helpers for particular template actions/controls
// Value equals
Template.registerHelper('equals', (a, b) => a === b);

// Value equals or...
Template.registerHelper('equals_or', (param, arr) => arr.split(',').indexOf(param) !== -1);

/**
 * @summary Produce a Friendly Date string
 * @function
 *   @param {Date} date
 * @returns {String}
 */
Template.registerHelper('friendlyDate', (date) => {
  // If string, convert to date
  const newDate = date instanceof Date ? date : new Date(date);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  // Create friendly date string
  return `${days[newDate.getUTCDay()]}, ${newDate.getUTCDate()} \
    ${months[newDate.getUTCMonth()]} ${newDate.getUTCFullYear()}`;
});

/**
 * @summary Produce a Date ISOString
 * @function
 *   @param {Date} date
 * @returns {String}
 */
Template.registerHelper('ISODate', (date) => {
  // If string, convert to date
  const newDate = date instanceof Date ? date : new Date(date);

  return newDate.toISOString();
});

Template.registerHelper('global_debug', text => console.log(text));
