import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

/**
 * Get Offset Top when using a relatively-positioned element
 * @function
 *   @param {Element} element
 */
const getOffsetTop = (element) => {
  let offsetTop = 0;
  let currentElement = element;

  while (currentElement) {
    offsetTop += currentElement.offsetTop;
    currentElement = currentElement.parentElement;
  }

  return offsetTop;
};

/**
 * Assign a template to a new section, then add it to the database
 * @method
 *   @param {Event} event
 */
const setTemplate = (event) => {
  const placeholder = document.querySelector('.placeholder');
  const menu = document.querySelector('#templates-menu');
  let parent;
  let elements;
  let index;

  // Remove menu from page
  if (menu instanceof Element) menu.remove();

  // Determine placeholder's parent
  if (placeholder instanceof Element && placeholder.dataset.parent) {
    parent = placeholder.dataset.parent; // eslint-disable-line prefer-destructuring
    elements = document.querySelectorAll(`[data-id="${parent}"] > menu li`);
  }

  // no parent defined
  elements = elements || document.querySelectorAll('.masterContainer > section');

  // Determine index of placeholder among its parent
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i] === placeholder) index = i + 1;
  }

  // If element doesn't exist, just put it at the end
  index = index || elements.length;

  // Remove placeholder
  placeholder.remove();

  // Add new section to database
  // @params { verb, template, index, parent }
  Meteor.call('addSection', event.target.dataset.template, index, parent);

  // Update sibling section order (only siblings which come after)
  // @params { verb, sectionId, newIndex}
  for (; index < elements.length; index += 1) {
    Meteor.call('updateSectionOrder', elements[index].dataset.id, index + 1);
  }
};

/**
 * Create menu for selecting template to use
 * @method
 *   @param {Event} event
 */
const createMenu = (event) => {
  // No bubbling, and stop the browser from doing its thing
  event.preventDefault();
  event.stopPropagation();

  // Create templates menu
  const menu = document.createElement('menu');

  // Get list of templates from database
  const templates = [
    { name: 'What We Do', template: 'work' },
    { name: 'Events', template: 'events' },
    { name: 'Who We Are', template: 'who' },
    { name: 'Get Involved', template: 'outreach' },
    { name: 'Service Providers', template: 'providers' },
    { name: 'Contact Us', template: 'contact' },
    { name: 'Masthead', template: 'masthead' }];

  // Anchor element
  let a;

  // Prepare the menu
  menu.id = 'templates-menu';
  menu.textContent = 'Pick a Template:';

  // Position menu
  menu.style.left = `${event.pageX}px`;
  menu.style.top = `${event.pageY}px`;

  // For each template, add a menu option
  for (let i = 0; i < templates.length; i += 1) {
    // Create the anchor
    a = document.createElement('a');
    a.href = '#';
    a.textContent = templates[i].name;
    a.dataset.template = templates[i].template;

    // Make the link useful
    a.addEventListener('click', setTemplate);

    // Add link to menu
    menu.appendChild(a);
  }

  // Add menu to page
  document.body.appendChild(menu);
};

/**
 * Create a new Section instance
 * @class
 *   @param {number} parent - The section's parent's ID, if it exists
 * @returns {Element}
 */
const Section = (parent) => {
  // Create the placeholder
  const placeholder = document.createElement('section');
  const stalePlaceholder = document.querySelector('.placeholder');

  // Retain parent ID
  if (parent) placeholder.dataset.parent = parent;

  // Clear any stale placeholder
  if (stalePlaceholder instanceof Element) stalePlaceholder.remove();

  // Create new placeholder
  placeholder.classList.add('placeholder');
  placeholder.textContent = 'CREATE NEW SECTION';

  // Bind drag events to "confirm" that location on puzzle piece drop
  placeholder.addEventListener('dragenter', (event) => {
    // Override inhereted event listener
    event.preventDefault();
    event.stopPropagation();
  });

  // This has to be set to allow the drop
  placeholder.addEventListener('dragover', event => event.preventDefault());


  // Handle removing placeholder
  placeholder.addEventListener('dragleave', () => {
    // Remove stale placeholder, but only if other sections exist
    if (document.querySelector('.masterContainer > section')) {
      if (stalePlaceholder instanceof Element) stalePlaceholder.remove();
    }
  });

  // Create template menu on drop
  placeholder.addEventListener('drop', createMenu);

  return placeholder;
};

/**
 * Handle placeholder addition
 * @method
 *   @param {$.Event} event - jQuery Event
 */
const placeholder = (event) => {
  event.stopPropagation();

  // Gather elements
  const target = event.currentTarget;

  // Calculate target's offset-top property, which is necessary since
  // sections are positioned relatively, nullifing this value
  const offsetTop = getOffsetTop(target);

  // Not every section has a parent section, so undefined is OK here
  const { parent } = target.dataset;

  // Create a new section
  const section = Section(parent);

  // More useful
  const oEvent = event.originalEvent;

  // Determine whether to place the placeholder before or after the target
  // NOTE: This technically could break HTML standards!!!
  //       This is because a <section> element cannot be a child of <ul>
  //       However, the use is small and impact null.
  if (oEvent.pageY > target.offsetTop
      && oEvent.pageY < (offsetTop + target.offsetHeight)) {
    // If mouse is over top half of element
    if (oEvent.pageY < (offsetTop + (target.offsetHeight / 2))) {
      target.parentElement.insertBefore(section, target);

    // Otherwise, if mouse is over bottom half of element
    } else if (oEvent.pageY > (offsetTop + (target.offsetHeight / 2))) {
      target.parentElement.insertBefore(section, target.nextElementSibling);
    }
  }
};

// Bind Drag-and-drop events for adding new sections
Template.body.events({
  // These are elements before and after which a placeholder element can exist
  'dragenter .masterContainer > section[data-id]': placeholder,

  // When no sections exist
  'dragenter .masterContainer': (event) => {
    event.stopPropagation();

    // If there are no sections on the page, add section, otherwise ignore
    if (!document.querySelector('.masterContainer > section')) {
      document.querySelector('.masterContainer').appendChild(Section());
    }
  },
});
