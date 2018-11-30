import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SHA256 } from 'meteor/sha';
import { ReactiveVar } from 'meteor/reactive-var';
import News from '/logic/news/schema';

import './post.html';

const item = new ReactiveVar();

/**
 * Handler for updating content
 * @method
 *   @param {string} oldHash - SHA256 hash of original markdown
 *     to detect if there was a change
 */
const updateContent = oldHash => (event) => {
  /**
   * Handler for updating content
   * @method
   *   @param {Event} event - Click event passed to handler
   */
  event.stopPropagation();
  event.preventDefault();

  const parent = event.target.parentElement;

  // Get section ID
  const { id } = event.target.parentElement.querySelector('section').dataset;
  const content = event.target.parentElement.querySelector('textarea').value;
  const newHash = SHA256(content);

  // Don't commit if nothing changed
  if (newHash !== oldHash) Meteor.call('updateNewsContent', id, content);

  // Restore view
  parent.classList.remove('edit');
  parent.querySelector('textarea').remove();
  parent.querySelector(':scope > button').remove();
};

Template.post.onRendered(function () {
  item.set(News.collection
    .findOne({ friendlyTitle: this.data.friendlyTitle })._id);
});

/** Helpers */
Template.post.helpers({
  /**
   * @summary SHA-256 Hash of content for use in change detection
   * @function
   * @returns {String}
   */
  hash() {
    const post = News.collection.findOne({ _id: item.get() });

    // Get content
    if (post && post.content) return SHA256(post.content);
    return '';
  },

  id: () => (item.get() ? News.collection.findOne({ _id: item.get() })._id : ''),
  content: () => (item.get() ? News.collection.findOne({ _id: item.get() }).content : ''),
  title: () => (item.get() ? News.collection.findOne({ _id: item.get() }).title : ''),

  home: {
    url: 'https://wcasa.org',
    text: 'Back to WCASA',
  },
  share: [{
    title: 'Tweet',
    icon: '&#xf099;',
    url: `https://twitter.com/intent/tweet?url=${window.location.href}`,
  }, {
    title: 'Share on Facebook',
    icon: '&#xf082;',
    url: `https://www.facebook.com/sharer/sharer.php?&u=${window.location.href}`,
  }, {
    title: 'Share on Google+',
    icon: '&#xf0d5;',
    url: `https://plus.google.com/share?url=${window.location.href}`,
  }, {
    title: 'Print',
    icon: '&#xf02f;',
    print: true,
    url: '#',
  }],
  footer: {
    media: {
      title: 'Media Contacts',
      contact: [{
        name: 'Kelly Moe Litke',
        org: 'WCASA',
        email: 'kellyml@wcasa.org',
      }],
    },
    about: [],
    social: [{
      id: 'Twitter',
      icon: '&#xf099;',
      url: 'https://twitter.com/wcasa_org',
    }, {
      id: 'Facebook',
      icon: '&#xf082;',
      url: 'https://www.facebook.com/wcasa',
    }, {
      id: 'YouTube',
      icon: '&#xf16a;',
      url: 'https://www.youtube.com/user/WCASAVPCC',
    }],
  },
});

/** Bind Post Template events */
Template.post.events({
  /**
   * @summary Edit a post
   * @method
   *   @param {$.Event} event
   */
  'click aside.admin button.edit': () => {
    // Get section to edit
    const id = item.get();
    const content = document.body.querySelector(`[data-id="${id}"]`);
    const parent = content.parentElement;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');
    button.textContent = 'Save';
    button.addEventListener(
      'click',
      // Pass along hash of existing markdown
      updateContent(content.dataset.hash),
    );

    // Textarea should get markdown
    textarea.textContent = News.collection.findOne({ _id: item.get() }).content;

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
  },
});
