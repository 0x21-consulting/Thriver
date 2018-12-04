import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import Marked from '/views/lib/marked';

import './markdown.html';

const preview = new ReactiveVar('');
const uploadUrl = new ReactiveVar();

const closeMenus = (container) => {
  const menus = container.querySelectorAll('.markdown-menu-dropdown');
  for (let i = 0, len = menus.length; i < len; i += 1) {
    if (!menus[i].classList.contains('hide')) menus[i].classList.add('hide');
  }
};

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
    const menu = event.target.parentElement.parentElement.querySelector('.markdown-menu');

    closeMenus(event.target.parentElement.parentElement.querySelector('.markdown-menu'));

    // Show/hide edit and preview elements
    if (event.target.classList.contains('edit')) {
      edit.classList.remove('hide');
      prev.classList.add('hide');
      if (menu.classList.contains('disabled')) menu.classList.remove('disabled');
    } else {
      edit.classList.add('hide');
      prev.classList.remove('hide');
      if (!menu.classList.contains('disabled')) menu.classList.add('disabled');
    }

    // Mark active
    event.target.parentElement.querySelectorAll('li')
      .forEach(elem => elem.classList.remove('active'));
    event.target.classList.add('active');
  },

  /**
   * Handle markdown options
   * @param {$.Event} event
   */
  'click ul.markdown-menu li'(event) {
    event.stopPropagation();

    const textarea = event.delegateTarget.querySelector('.markdown-editor textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const first = textarea.value.substring(0, start);
    const last = textarea.value.substring(end);
    const selection = textarea.value.substring(start, end);
    const dropdown = event.target.querySelector('.markdown-menu-dropdown');

    if (dropdown === null) {
      if (!event.target.classList.contains('markdown-menu-dropdown')) closeMenus(event.target.parentElement);
    } else if (dropdown.classList.contains('hide')) {
      closeMenus(event.target.parentElement);
    }

    // What do we insert?
    let insertBefore = '';
    let insertAfter = '';
    switch (event.target.className) {
      case 'bold':
        insertBefore = '**';
        insertAfter = '**';
        break;
      case 'italics':
        insertBefore = '__';
        insertAfter = '__';
        break;
      case 'quote':
        insertBefore = '\n> ';
        break;
      case 'code':
        insertBefore = '`';
        insertAfter = '`';
        break;
      case 'ol':
        insertBefore = '\n1. ';
        insertAfter = '\n';
        break;
      case 'ul':
        insertBefore = '\n- ';
        insertAfter = '\n';
        break;
      case 'h1':
        insertBefore = '\n\n# ';
        insertAfter = '\n\n';
        break;
      case 'h2':
        insertBefore = '\n\n## ';
        insertAfter = '\n\n';
        break;
      case 'h3':
        insertBefore = '\n\n### ';
        insertAfter = '\n\n';
        break;
      default:
        return;
    }

    // Embolden selection
    if (selection) {
      textarea.value = `${first}${insertBefore}${selection}${insertAfter}${last}`;
    } else {
      // Insert bold and place cursor
      textarea.value = `${first}${insertBefore}${insertAfter}${last}`;
      textarea.selectionStart = start + insertBefore.length;
      textarea.selectionEnd = textarea.selectionStart;
    }

    textarea.focus();

    // Close any drop downs
    if (!event.target.parentElement.classList.contains('markdown-menu')) {
      event.target.parentElement.classList.add('hide');
    }
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
   * Handle showing link and image drop downs
   * @param {$.Event} event
   */
  'click ul.markdown-menu li.a, click ul.markdown-menu li.img'(event) {
    const aside = event.target.querySelector('aside');
    const textarea = event.delegateTarget.querySelector('.markdown-editor textarea');

    if (aside) {
      if (aside.classList.contains('hide')) {
        aside.classList.remove('hide');

        // Populate text field if there is a selection
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start !== end) {
          aside.querySelector('[type="text"]').value = textarea.value.substring(start, end);
        }
      } else aside.classList.add('hide');
    }
  },

  /**
   * Handle inserting link
   * @param {$.Event} event
   */
  'click ul.markdown-menu li.a button'(event) {
    event.preventDefault();

    const textarea = event.delegateTarget.querySelector('.markdown-editor textarea');
    const parent = event.target.parentElement;
    const text = parent.querySelector('[name="text"]');
    const url = parent.querySelector('[name="url"]');
    let fileUrl;

    if (uploadUrl.get()) fileUrl = uploadUrl.get(); else fileUrl = url.value;

    // Insert link markdown
    const start = textarea.selectionStart; // current cursor position
    const end = textarea.selectionEnd;
    textarea.value = `${textarea.value.substring(0, start)}[${text.value}](${fileUrl})${textarea.value.substring(end)}`;
    textarea.focus();

    // Clear and close form
    text.value = '';
    url.value = '';
    parent.classList.add('hide');
  },

  /**
   * Handle inserting image
   * @param {$.Event} event
   */
  'click ul.markdown-menu li.img button'(event) {
    event.preventDefault();

    const textarea = event.delegateTarget.querySelector('.markdown-editor textarea');
    const parent = event.target.parentElement;
    const description = parent.querySelector('[name="description"]');
    const alignment = parent.querySelector('[name="alignment"][checked]');
    const url = parent.querySelector('[name="url"]');
    let imageUrl;

    if (uploadUrl.get()) imageUrl = uploadUrl.get(); else imageUrl = url.value;

    // Insert link markdown
    const start = textarea.selectionStart; // current cursor position
    const end = textarea.selectionEnd;
    const first = textarea.value.substring(0, start);
    const last = textarea.value.substring(end);
    textarea.value = `${first}![${alignment.value}: ${description.value}](${imageUrl})${last}`;
    textarea.focus();

    // Clear and close form
    description.value = '';
    url.value = '';
    uploadUrl.set();
    parent.classList.add('hide');
  },

  /**
   * Handle upload image
   * @param {$.Event} event
   */
  'change ul.markdown-menu li input[type="file"]'(event) {
    event.preventDefault();

    const [file] = event.target.parentElement.querySelector('input').files;
    const { name, type } = file;

    const reader = new FileReader();

    // Read in data
    reader.addEventListener('load', (loadEvent) => {
      const data = loadEvent.target.result;
      const xhr = new XMLHttpRequest();
      const form = new FormData();

      form.append(name, new Blob([data], { type }));

      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) uploadUrl.set(xhr.responseText);
      });

      xhr.addEventListener('error', error => console.error(error));

      xhr.open('POST', '/uploadFile', true);

      // Send authentication details
      // eslint-disable-next-line no-underscore-dangle
      xhr.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken());
      xhr.setRequestHeader('X-User-Id', Meteor.userId());

      xhr.send(form);
    });

    reader.readAsArrayBuffer(file);
  },

  /**
   * Close menus on interaction with textarea
   * @param {$.Event} event
   */
  'click .markdown-editor textarea'(event) {
    closeMenus(event.target.parentElement.parentElement.querySelector('.markdown-menu'));
  },
});

Template.markdownEditor.onRendered(() => {
  preview.set(Template.instance().data.content);
});
