/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
const handler = (event) => {
  check(event, Event);
  event.stopPropagation();

  if (event.which) {
    if (event.which === 13) {
      this.blur();
      return false;
    }
    return false;
  }

  // Get section ID
  const { target } = event;
  const { id } = target.parentElement.parentElement.dataset;
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
    const { target } = event;
    const { id } = target.parentElement.parentElement.dataset;
    const content = target.parentElement.querySelector('textarea').value;
    const newHash = SHA256(content);

    // Don't commit if nothing changed
    if (newHash !== oldHash) Meteor.call('updateSectionData', id, { content });

    // Restore view
    parent.classList.remove('edit');
    parent.querySelector('textarea').remove();
    parent.querySelector(':scope > button.save').remove();
    parent.querySelector(':scope > button.cancel').remove();
  };
};

Template.workNav.events({
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
    let parent = event.target.parentElement.parentElement.parentElement;
    let elems;

    // If this parent element has an ID, this is a sub page
    if (parent.dataset.id) {
      elems = parent.querySelectorAll('li[data-id]');
    } else {
      // Top-level page; get ID for work section
      parent = event.delegateTarget.parentElement.parentElement;
      elems = parent.querySelectorAll('menu.workNav > ul > li[data-id]');
    }

    // Determine index
    const index = elems.length;

    Meteor.call(
      'addSection', 'article', index, parent.dataset.id, 'Unnamed Page',
      (error, id) => {
        Template.workListItem.onRendered(() => {
          // Let's be helpful and navigate to the new page
          const link = document.querySelector(`li[data-id="${id}"] > a`);
          link.click();
        });
      },
    );
  },
});

Template.workContent.events({
  /**
   * Edit section name
   * @method
   *   @param {$.Event} event - jQuery Event handle
   */
  'click h2.workContentAdmin': (event) => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    const { target } = event;

    // Make content editable to allow user to change
    target.contentEditable = true;

    // Calculate SHA hash to detect whether a change was made
    target.dataset.hash = SHA256(target.textContent);

    // On blur or on enter, submit name change
    target.addEventListener('blur', handler);
    target.addEventListener('keypress', handler);
  },

  /**
   * Delete a section
   * @method
   *   @param {$.Event} event - jQuery Event handle
   */
  'click header button.delete': function deleteSection(event) {
    // Can't use lambda expression because of lexical `this`
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Get Nav link
    const link = event.delegateTarget.parentElement
      .querySelector(`menu [data-id="${this.id}"]`)
      .parentElement.parentElement;

    let parent;

    // If the nav link has a parent with an ID, this is a tab
    if (link.dataset.id) parent = link.dataset.id;
    else {
      // Otherwise parent is just the work section
      parent = event.delegateTarget.parentElement.parentElement.dataset.id;
    }

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
  'click header button.edit': function editSectionMarkdown(event) {
    // Can't use lambda expression because of lexical `this`
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Get section to edit
    const section = event.delegateTarget.querySelector(`[data-id="${this.id}"]`);
    const content = section.querySelector('.workTextContainer');
    const parent = content.parentElement;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');

    button.textContent = 'Save';
    button.classList.add('save');
    button.addEventListener(
      'mouseup',
      // Pass along hash of existing markdown
      updateSectionContent(content.dataset.hash),
    );

    // Button to cancel edit
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.classList.add('cancel');

    // Textarea should get markdown
    textarea.textContent = Thriver.sections.get(this.id, ['data']).data.content;

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
    parent.appendChild(cancel);
  },

  /**
   * @summary Close edit page
   * @method
   *   @param {$.Event} event
   */
  'click button.cancel': (event) => {
    check(event, $.Event);

    const parent = event.target.parentElement;
    parent.classList.remove('edit');

    // Remove buttons and textarea
    parent.querySelector('textarea').remove();
    const buttons = parent.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i += 1) buttons[i].remove();
  },
});

// About SA events
Template.aboutSA.events({
  /**
   * @summary Edit Section markdown
   * @method
   *   @param {$.Event} event
   */
  'click button.edit': (event) => {
    check(event, $.Event);

    const section = event.target.parentElement.querySelector('section > section');
    const parent = section.parentElement;
    const id = Template.instance().data._id;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');

    button.textContent = 'Save';
    button.addEventListener('mouseup', (eventNew) => {
      check(eventNew, Event);

      // Get section ID
      const content = eventNew.target.parentElement.querySelector('textarea').value;
      const newHash = SHA256(content);

      // Don't commit if nothing changed
      if (newHash !== section.dataset.hash) {
        Meteor.call('updateSectionData', id, { aboutSA: content });
      }

      // Restore view
      parent.parentElement.classList.remove('edit');
      parent.querySelector('textarea').remove();
      const buttons = parent.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i += 1) buttons[i].remove();
    });

    // Textarea should get markdown
    textarea.textContent = Thriver.sections.get(id, ['data']).data.aboutSA;

    // Cancel button
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.addEventListener('mouseup', (eventNew) => {
      check(eventNew, Event);

      const parentNew = eventNew.target.parentElement;
      parentNew.parentElement.classList.remove('edit');

      // Remove buttons and textarea
      parentNew.querySelector('textarea').remove();
      const buttons = parentNew.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i += 1) buttons[i].remove();
    });

    // Add textarea but hide preview
    parent.parentElement.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
    parent.appendChild(cancel);
  },
});
