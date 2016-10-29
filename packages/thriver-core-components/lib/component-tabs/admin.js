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
    let parent = event.target.parentElement.parentElement.parentElement;

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

    Meteor.call('addSection', 'article', index, parent.dataset.id, 'Unnamed Page',
      (error, id) =>
        Template.tabs.onRendered(() => {
          // Let's be helpful and navigate to the new page
          const link = document.querySelector(`li[data-id="${id}"] > a`);
          link.click();
        }));
  },
});

Template.generic.helpers({
  hash: (data) => {
    check(data, Object);
    check(data.id, String);

    let content = Thriver.sections.get(data.id, ['data']).data.content;

    if (!content) content = '';

    return SHA256(content);
  },
});
