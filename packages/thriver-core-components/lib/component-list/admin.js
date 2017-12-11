/**
 * Handler for updating section names
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

  // Get section IDs
  const opportunity = target.parentElement.parentElement.parentElement.parentElement.parentElement;
  const opportunityID = opportunity.dataset.id;
  const parentID = opportunity.parentElement.parentElement.parentElement.dataset.id;
  const name = target.textContent;

  // Remove editability
  target.contentEditable = false;

  // Add to db
  if (target.dataset.hash !== SHA256(name)) {
    target.textContent = '';
    Meteor.call('updateOpportunityName', parentID, opportunityID, name);
  }

  return false;
};

/**
 * Handler for updating section content
 * @method
 *   @param {string} oldHash       - SHA256 hash of original markdown
 *   @param {string} parentID      - ID of parent element
 *   @param {string} opportunityID - ID of opportunity to modify
 *     to detect if there was a change
 */
const updateSectionContent = (oldHash, parentID, opportunityID) => {
  check(oldHash, String);
  check(parentID, String);
  check(opportunityID, String);

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
    const content = parent.querySelector('textarea').value;
    const newHash = SHA256(content);

    // Don't commit if nothing changed
    if (newHash !== oldHash) {
      Meteor.call('updateOpportunityContent', parentID, opportunityID, content);
    }

    // Restore view
    parent.classList.remove('edit');
    parent.querySelector('textarea').remove();
    parent.querySelector(':scope > button').remove();
  };
};

Template.list.events({
  /**
   * @summary Delete an opportunity
   * @method
   *   @param {$.Event} event
   */
  'click aside.admin button.oppDelete': function deleteOpportunity(event) {
    // Can't use lambda expression because of lexical `this`
    check(event, $.Event);

    const { id } = Template.parentData();

    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      Meteor.call('deleteOpportunity', id, this.id);
    }
  },

  /**
   * @summary Edit opportunity content
   * @method
   *   @param {$.Event} event
   */
  'click aside.admin button.oppEdit': function editOpportunity(event) {
    // Can't use lambda expression because of lexical `this`
    check(event, $.Event);

    // Get section to Edit
    const section = event.delegateTarget.querySelector(`article[data-id="${this.id}"]`);
    const content = section.querySelector('div.inner');
    const parent = content.parentElement;
    const parentID = event.delegateTarget.parentElement.dataset.id;
    const data = Thriver.sections.get(parentID, ['data']).data.opportunities;

    // Create a textarea element through which to edit markdown
    const textarea = document.createElement('textarea');

    // Button by which to okay changes and commit to db
    const button = document.createElement('button');
    button.textContent = 'Save';
    button.addEventListener(
      'mouseup',
      updateSectionContent(SHA256(this.content), parentID, this.id),
    );

    // Textarea should get markdown
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === this.id) textarea.textContent = data[i].content;
    }

    // Add textarea but hide preview
    parent.classList.add('edit');
    parent.appendChild(textarea);
    parent.appendChild(button);
  },

  /**
   * @summary Edit opportunity name
   * @method
   *   @param {$.Event} event
   */
  'click details article a > h3': (event) => {
    check(event, $.Event);

    const newEvent = event;

    // Make content editable to allow user to change
    newEvent.target.contentEditable = true;

    // Calculate SHA hash to detect whether a change was made
    newEvent.target.dataset.hash = SHA256(event.target.textContent);

    // On blur or on enter, submit name change
    event.target.addEventListener('blur', handler);
    event.target.addEventListener('keypress', handler);
  },
});
