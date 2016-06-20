'use strict';

// Subscriptions
Meteor.subscribe('site');

/**
 * Handle placeholder addition
 * @method
 *   @param {Event} event - jQuery Event
 */
var placeholder = function (event) {
    // Mutual Suspicion
    if (!event || !(event instanceof $.Event))
        throw new Error('No event passed');

    event.stopPropagation(); // don't bubble

    // Gather elements
    var target = event.currentTarget,

    // Calculate target's offset-top property, which is necessary since
    // sections are positioned relatively, nullifing this value
    offsetTop = getOffsetTop(target),

    // Not every section has a parent section, so undefined is OK here
    parent  = target.dataset.parent,

    // Create a new section
    section = new Section(parent);

    // More useful
    event   = event.originalEvent;

    // Determine whether to place the placeholder before or after the target
    // TODO: This technically breaks HTML standards!!!
    //       This is because a <section> element cannot be a child of <ul>
    if (event.pageY > target.offsetTop && event.pageY <
        ( offsetTop + target.offsetHeight ) ) {

            // If mouse is over top half of element
            if (event.pageY < ( offsetTop + target.offsetHeight / 2 ) )
                target.parentElement.insertBefore(section, target);
            // Otherwise, if mouse is over bottom half of element
            else if (event.pageY > ( offsetTop + target.offsetHeight / 2 ) )
                target.parentElement.insertBefore(section, target.nextElementSibling);
    }
},
/**
 * Get Offset Top when using a relatively-positioned element
 * @function
 *   @param {Element} element
 */
getOffsetTop = function (element) {
    var offsetTop = 0;

    while (element) {
        offsetTop += element.offsetTop;
        element = element.parentElement;
    }

    return offsetTop;
},
/**
 * Create a new Section instance
 * @class
 *   @param {number} parent - The section's parent's ID, if it exists
 * @returns {Element}
 */
Section = function (parent) {
    // Create the placeholder
    var placeholder      = document.createElement('section'),
        stalePlaceholder = document.querySelector('.placeholder');

    // Retain parent ID
    if (parent)
        placeholder.dataset.parent = parent;

    // Clear any stale placeholder
    if (stalePlaceholder instanceof Element)
        stalePlaceholder.remove();

    // Create new placeholder
    placeholder.classList.add('placeholder');
    placeholder.textContent = 'CREATE NEW SECTION';

    // Bind drag events to "confirm" that location on puzzle piece drop
    placeholder.addEventListener('dragenter', function (event) {
        // Override inhereted event listener
        event.preventDefault();  event.stopPropagation();
    });

    // This has to be set to allow the drop
    placeholder.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    // Handle removing placeholder
    placeholder.addEventListener('dragleave', function (event) {
        var stalePlaceholder = document.querySelector('.placeholder');

        // Remove stale placeholder, but only if other sections exist
        if (document.querySelector('.masterContainer > section'))
            if (stalePlaceholder instanceof Element)
                stalePlaceholder.remove();
    });

    // Create template menu on drop
    placeholder.addEventListener('drop', createMenu);

    return placeholder;
},

/**
 * Create menu for selecting template to use
 * @method
 *   @param {Event} event
 */
createMenu = function (event) {
    // Mutual Suspicion
    if (!event || !(event instanceof Event))
        throw new Error('No event passed');

    // No bubbling, and stop the browser from doing its thing
    event.preventDefault(); event.stopPropagation();

    // Create templates menu
    var menu = document.createElement('menu'),
        // Get list of templates from database
        templates = Site.findOne({}, { templates: 1 }),
        //
        a, i = 0, j;

    // Templates is actually a property
    if (!templates)
        throw new RangeError('There are no templates in the database.');
    templates = templates.templates;

    // Prepare the menu
    menu.id = 'templates-menu';
    menu.textContent = 'Pick a Template:';

    // Position menu
    menu.style.left = event.pageX + 'px';
    menu.style.top  = event.pageY + 'px';

    // For each template, add a menu option
    for (j = templates.length; i < j; ++i) {
        // Create the anchor
        a                  = document.createElement('a');
        a.href             = 'javascript:void(0)';
        a.textContent      = templates[i].name;
        a.dataset.template = templates[i].template;

        // Make the link useful
        a.addEventListener('click', setTemplate);

        // Add link to menu
        menu.appendChild(a);
    }

    // Add menu to page
    document.body.appendChild(menu);
},

/**
 * Assign a template to a new section, then add it to the database
 * @method
 *   @param {Event} event
 */
setTemplate = function (event) {
    var placeholder = document.querySelector('.placeholder'),
        menu        = document.querySelector('#templates-menu'),
        parent, elements, i, j, index;

    // Remove menu from page
    if (menu instanceof Element)
        menu.remove();

    // Determine placeholder's parent
    if (placeholder instanceof Element && placeholder.dataset.parent) {
        parent = placeholder.dataset.parent;
        elements = document.querySelectorAll('[data-id="' +
            parent + '"] > menu li');
    }

    // no parent defined
    elements = elements || document.querySelectorAll('.masterContainer > section');

    // Determine index of placeholder among its parent
    for (i = 0, j = elements.length; i < j; ++i)
        if (elements[i] === placeholder)
            index = i;

    // If element doesn't exist, just put it at the end
    index = index || elements.length;

    // Remove placeholder
    placeholder.remove();

    // Add new section to database
    // @params { verb, template, index, parent }
    Meteor.call('addSection', this.dataset.template, index, parent);

    // Update sibling section order (only siblings which come after)
    // @params { verb, sectionId, newIndex}
    for (; index < j; ++index)
        Meteor.call('updateSectionOrder', elements[index].dataset.id, index + 1);

    // BUG: New sections don't appear in correct order for whatever reason.
    //      Just reload page in the meantime...
    location.reload();
};

// Bind Drag-and-drop events for adding new sections
Template.body.events({
    // These are elements before and after which a placeholder element can exist
    'dragenter .masterContainer > section[data-id]': placeholder,
    //'dragenter menu.tabs li'           : placeholder,

    // When no sections exist
    'dragenter .masterContainer': function (event) {
        // Mutual Suspicion
        if (!event || !(event instanceof $.Event))
            throw new Error('No event passed');

        event.stopPropagation(); // no bubbling

        // If there are no sections on the page, add section, otherwise ignore
        if (!document.querySelector('.masterContainer > section'))
            document.querySelector('.masterContainer').appendChild(new Section());
    },
    /*'dragenter menu.tabs': function (event) {
        // Mutual Suspicion
        if (!event || !(event instanceof $.Event))
            throw new Error('No event passed');

        event.stopPropagation(); // no bubbling

        var target = event.currentTarget;

        // If there are no tabs, add a section, otherwise ignore
        if (!target.querySelector('li'))
            // TODO: This technically breaks HTML standards!!!
            target.querySelector('ul').appendChild(
                new Section(target.parentElement.dataset.id));
    }*/
});