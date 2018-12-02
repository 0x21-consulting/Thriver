import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Marked from '/views/lib/marked';

import './markdown.html';

const preview = new ReactiveVar('');

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

Template.markdownEditor.helpers({
  preview: () => preview.get(),
});

Template.markdownEditor.events({
  'keyup .markdown-editor textarea'(event) {
    preview.set(event.target.value);
  },

  /**
   * Handle switching between edit and preview modes
   * @param {$.Event} event
   */
  'click ul.edit-menu li'(event) {
    const parent = event.target.parentElement.parentElement
      .parentElement.querySelector('.markdown-editor');
    const edit = parent.querySelector('textarea');
    const prev = parent.querySelector('.preview');

    // Show/hide edit and preview elements
    if (event.target.classList.contains('edit')) {
      edit.classList.remove('hide');
      prev.classList.add('hide');
    } else {
      edit.classList.add('hide');
      prev.classList.remove('hide');
    }

    // Mark active
    event.target.parentElement.querySelectorAll('li')
      .forEach(elem => elem.classList.remove('active'));
    event.target.classList.add('active');
  },

  /**
   * Handle showing headers dropdown menu
   * @param {$.Event} event
   */
  'click ul.markdown-menu li.headers'(event) {
    const ul = event.target.querySelector('ul');

    if (ul) {
      if (ul.classList.contains('hide')) ul.classList.remove('hide');
      else ul.classList.add('hide');
    }
  },

  /**
   * Handle inserting headers
   * @param {$.Event} event
   */
  'click ul.markdown-menu li.headers ul li'(event) {
    event.stopPropagation();

    const textarea = event.delegateTarget.querySelector('.markdown-editor textarea');

    switch (event.target.className) {
      case 'h1': textarea.value += '\n\n# '; break;
      case 'h2': textarea.value += '\n\n## '; break;
      case 'h3': textarea.value += '\n\n### '; break;
      default:
    }

    // Hide dropdown menu
    event.target.parentElement.classList.add('hide');
  },
});

Template.markdownEditor.onRendered(() => {
  preview.set(Template.instance().data.content);
});
