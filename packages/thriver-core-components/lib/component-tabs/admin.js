Template.tabs.events({
    /**
     * Add new section
     * @method
     *   @param {$.Event} event - jQuery Event handle
     */
    'click li.new-section a': function (event) {
        var parent;

        check(event, $.Event);

        event.preventDefault();
        event.stopPropagation();

        // Get arbitrary parent element
        parent = event.target.parentElement.parentElement.parentElement;

        // If this parent element has an ID, this is a sub page
        if (parent.dataset.id) {
            parent = parent;
            elems  = parent.querySelectorAll('li[data-id]');
        } else {
            // Top-level page; get ID for work section
            parent = event.delegateTarget.parentElement.parentElement;
            elems  = parent.querySelectorAll('menu > li[data-id]');
        }

        // Determine index
        index = elems.length;

        Meteor.call('addSection', 'article', index, parent.dataset.id, 'Unnamed Page',
            function (error, id) {
                Template.tabs.onRendered(function () {
                    // Let's be helpful and navigate to the new page
                    var link = document.querySelector('li[data-id="' + id + '"] > a');
                    link.click();
                });
            });
    }
});
