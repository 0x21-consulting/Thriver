/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
const handler = (event) => {
  check(event, Event);

  event.stopPropagation();

  const { target } = event;

  if (event.which) {
    if (event.which === 13) {
      target.blur();
      return false;
    }

    return false;
  }

  // Get section ID
  const { id } = target.parentElement.dataset;
  const name = target.textContent;

  // Remove editability
  target.contentEditable = false;

  // Add to db
  if (target.dataset.hash !== SHA256(name)) {
    target.textContent = '';
    Meteor.call('updateSectionName', id, name);
  }

  return false;
};

/**
 * Handler for updating section content
 * @method
 *   @param {string} oldHash - SHA256 hash of original markdown
 *     to detect if there was a change
 */
const updateSectionContent = (oldHash) => {
  check(oldHash, String);

  /**
   * Handler for updating section content
   * @method
   *   @param {Event} event - Click event passed to handler
   */
  return (event) => {
    check(event, Event);

    event.stopPropagation();
    event.preventDefault();

    const parent = event.target.parentElement;

    // Get section ID
    const { id } = parent.dataset;
    const content = parent.querySelector('textarea').value;
    const newHash = SHA256(content);

    // Don't commit if nothing changed
    if (newHash !== oldHash) Meteor.call('updateSectionData', id, { content });

    // Restore view
    parent.classList.remove('edit');
    parent.querySelector('textarea').remove();
    parent.querySelector(':scope > button').remove();
  };
};

Template.tabs.events({
  /**
   * Add new section
   * @method
   *   @param {$.Event} event - jQuery Event handle
   */
  'click li.new-section a': (event) => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Get arbitrary parent element
    let parent = event.delegateTarget.parentElement.parentElement.parentElement;

    let elems;

    // If this parent element has an ID, this is a sub page
    if (parent.dataset.id) {
      elems = parent.querySelectorAll('li[data-id]');
    } else {
      // Top-level page; get ID for work section
      parent = event.delegateTarget.parentElement.parentElement;
      elems = parent.querySelectorAll('menu > li[data-id]');
    }

    // Determine index
    const index = elems.length;

    Meteor.call(
      'addSection',
      'article',
      index,
      parent.dataset.id,
      'Unnamed Page',
      (error, id) =>
        Template.tabs.onRendered(() => {
          // Let's be helpful and navigate to the new page
          const link = document.querySelector(`li[data-id="${id}"] > a`);
          link.click();
        }),
    );
  },

  /**
   * @summary Add a list item
   * @method
   *   @param {$.Event} event
   */
  'click [editable!="false"] button.add': (event) => {
    check(event, $.Event);

    event.preventDefault();

    const { id } = event.target.parentElement.parentElement.dataset;

    Meteor.call('addOpportunity', id, {
      title: 'New Opportunity',
      content: '',
    });
  },

  /**
   * Edit section name
   * @method
   *   @param {$.Event} event - jQuery Event handle
   */
  'click article[data-editable="true"] h2': (event) => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    const { target } = event;

    // Make content editable to allow user to change
    target.contentEditable = true;

    // Calculate SHA hash to detect whether a change was made
    target.dataset.hash = SHA256(target.textContent);

    // On blur or on enter, submit name change
    event.target.addEventListener('blur', handler);
    event.target.addEventListener('keypress', handler);
  },

  /**
   * Delete a section
   * @method
   *   @param {$.Event} event - jQuery Event handle
   */
  'click div.tabs > article[editable!="false"] > aside.admin > button.delete': function deleteSection(event) {
    // Can't use lambda expression here on account of lexical `this`
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Get Nav link
    const link = event.delegateTarget.parentElement
      .querySelector(`menu [data-id="${this.id}"]`).parentElement.parentElement;

    let parent;

    // If the nav link has a parent with an ID, this is a tab
    if (link.dataset.id) parent = link.dataset.id;

    // Otherwise parent is just the work section
    else parent = Template.parentData()._id;

    // Warn
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    // First, remove reference to parent element
    // first parameter is parent ID, second this ID
    Meteor.call('removeChild', parent, this.id);

    // Then delete this section
    Meteor.call('deleteSection', this.id);
  },

  /**
   * Edit section markdown
   * @method
   *   @param {$.Event} event - jQuery event handler
   */
  'click [editable!="false"] button.edit': function editSection(event) {
    // Can't use lambda expression because of lexical `this`
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Get section to edit
    const section = event.delegateTarget.querySelector('article[aria-hidden="false"]');
    const content = section.querySelector(':scope section');
    const parent = content.parentElement;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');
    button.textContent = 'Save';
    button.addEventListener(
      'mouseup',
      // Pass along hash of existing markdown
      updateSectionContent(content.dataset.hash),
    );

    // Textarea should get markdown
    textarea.textContent = Thriver.sections.get(this.id, ['data']).data.content;

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
  },
});

Template.generic.helpers({
  hash: (data) => {
    check(data, Object);
    check(data.id, String);

    const section = Thriver.sections.get(data.id, ['data']);

    if (section) {
      let { content } = section.data;

      if (!content) content = '';

      return SHA256(content);
    }

    return '';
  },
});
