/**
 * Handler for updating content
 * @method
 *   @param {string} oldHash - SHA256 hash of original markdown
 *     to detect if there was a change
 */
const updateContent = (oldHash) => {
  check(oldHash, String);

  /**
   * Handler for updating content
   * @method
   *   @param {Event} event - Click event passed to handler
   */
  return (event) => {
    check(event, Event);

    event.stopPropagation();
    event.preventDefault();

    const parent = event.target.parentElement;

    // Get section ID
    const id = event.target.parentElement.querySelector('section').dataset.id;
    const content = event.target.parentElement.querySelector('textarea').value;
    const newHash = SHA256(content);

    // Don't commit if nothing changed
    if (newHash !== oldHash) Meteor.call('updateNewsContent', id, content);

    // Restore view
    parent.classList.remove('edit');
    parent.querySelector('textarea').remove();
    parent.querySelector(':scope > button').remove();
  };
};

/** Helpers */
Template.post.helpers({
  /**
   * @summary SHA-256 Hash of content for use in change detection
   * @function
   * @returns {String}
   */
  hash: () => {
    let content = Thriver.newsroom.collection.findOne({ _id: this._id }, {
      content: 1 });

    // Sometimes this helper executes before the collection is ready
    // If so, just return and wait for the rerun
    if (!content) return '';

    // Get content
    content = content.content;

    if (content) return SHA256(content);

    return '';
  },

  home: {
    url: '/',
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
        name: 'Dominic Holt',
        org: 'WCASA',
        phone: '608-257-1516',
        phoneExt: '113',
        email: 'dominich@wcasa.org',
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
  'click aside.admin button.edit': (event) => {
    check(event, $.Event);

    // Get section to edit
    const data = Template.instance().data;
    const content = document.body.querySelector(`[data-id="${data._id}"]`);
    const parent = content.parentElement;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');
    button.textContent = 'Save';
    button.addEventListener('mouseup',
      // Pass along hash of existing markdown
      updateContent(content.dataset.hash));

    // Textarea should get markdown
    textarea.textContent = Thriver.newsroom.collection.findOne(
      { _id: data._id }, { content: 1 }).content;

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
  },
});
