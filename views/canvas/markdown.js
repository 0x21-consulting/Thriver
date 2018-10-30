import { Template } from 'meteor/templating';
import Marked from '/views/lib/marked';

/**
 * @summary Convert markdown into HTML
 * @function
 *   @param {String} text - Text to convert
 * @returns {String}
 */
Template.registerHelper('markdown', (text) => {
  // Sometimes a document will not have any content
  if (text === undefined) return '';

  // Convert markdown to html
  const html = Marked(text);

  // Remove <p> tags
  return html.trim().replace(/^<p>/i, '').replace(/<\/p>$/i, '');
});
