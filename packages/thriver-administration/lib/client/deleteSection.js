// Delete section
Template.sectionAdmin.events({
  /**
   * @summary Delete a section
   * @method
   *   @param {$.Event} event
   */
  'click button.section-delete': (event) => {
    check(event, $.Event);

    event.stopPropagation();
    event.preventDefault();

    if (!event.delegateTarget || !event.delegateTarget.dataset) return;

    // Are you sure??
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    const { id } = event.delegateTarget.dataset;
    const link = document.querySelector(`menu [data-id="${id}"]`);

    // Get siblings
    const elements = event.delegateTarget.parentElement
      .querySelectorAll(':scope > section[data-id]');

    // Start index at the one to delete
    let index;

    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].dataset.id === id) index = i;
    }

    // Call delete method
    if (id) Meteor.call('deleteSection', id);

    // And update parent to remove from child list
    if (link && link.dataset.parent) Meteor.call('removeChild', link.dataset.parent, id);

    // Update order of remaining sibling elements
    for (; index < elements.length; index += 1) {
      Meteor.call('updateSectionOrder', elements[index].dataset.id, index);
    }
  },
});
