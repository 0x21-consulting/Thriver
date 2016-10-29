/**
 * @summary Show page upon menu item click
 * @method
 *   @param {$.Event} event
 */
const toggleTabs = (event) => {
  check(event, $.Event);

  event.preventDefault();

  // Tabs Variables
  const menu = event.target.parentNode.parentNode;
  const links = menu.querySelectorAll('[aria-controls][data-toggle=tabs]');
  const sections = menu.parentNode.querySelectorAll('div.tabs [aria-hidden]');

  // Remove active state from all links
  for (let i = 0; i < links.length; i += 1) Thriver.util.makeActive(links[i], false);

  // Hide all sections
  for (let i = 0; i < sections.length; i += 1) Thriver.util.hide(sections[i], true);

  // Set link as active
  Thriver.util.makeActive(event.target, true);

  // Set section as active
  Thriver.util.hide(menu.parentElement
    .querySelector(`article[data-id="${event.target.dataset.id}"]`), false);

  // Special case for Library??  Why??
  switch (event.target.getAttribute('aria-controls')) {
    case '#library':
      document.querySelector('aside.filter').classList.add('active-filter'); break;
    default:
      document.querySelector('aside.filter').classList.remove('active-filter');
  }
};

Template.body.events({
  // Tabs
  'click [data-toggle=tabs]': toggleTabs,
});

/**
 * Handler for updating work section names
 * @method
 *   @param {Event} event - KeyboardEvent passed to handler
 */
const handler = (event) => {
  check(event, Event);

  event.stopPropagation();

  const target = event.target;

  if (event.which) {
    if (event.which === 13) {
      target.blur();
      return false;
    }

    return false;
  }

  // Get section ID
  const id = this.parentElement.dataset.id;
  const name = this.textContent;

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
    const id = parent.dataset.id;
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

// Administrative bindings
Template.tabs.events({
  /**
   * @summary Add a list item
   * @method
   *   @param {$.Event} event
   */
  'click [editable!="false"] button.add': (event) => {
    check(event, $.Event);

    event.preventDefault();

    const id = event.target.parentElement.parentElement.dataset.id;

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
  'click [editable!="false"] h2': (event) => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    const target = event.target;

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
  'click div.tabs > article[editable!="false"] > aside.admin > button.delete': (event) => {
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
    else parent = event.delegateTarget.parentElement.parentElement.dataset.id;

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
  'click [editable!="false"] button.edit': (event) => {
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
    button.addEventListener('mouseup',
      // Pass along hash of existing markdown
      updateSectionContent(content.dataset.hash));

    // Textarea should get markdown
    textarea.textContent = Thriver.sections.get(event.target.id, ['data']).data.content;

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
  },
});
