// UI Helper Functions
Thriver.util = {
  // Add Class
  addClass: (element, className) => {
    check(element, Element);
    check(className, String);

    element.classList.add(className);
  },

  // Remove Class
  removeClass: (element, className) => {
    check(element, Element);
    check(className, String);

    element.classList.remove(className);
  },

  // Remove Class (by Prefix)
  removeClassByPrefix: (element, prefix) => {
    check(element, Element);
    check(prefix, String);

    const regx = new RegExp(`\\b${prefix}.*?\\b`, 'g');

    const newElement = element;
    newElement.className = newElement.className.replace(regx, '');
    return newElement;
  },

  hide: (element, state) => {
    check(element, Element);
    check(state, Match.Maybe(Boolean));

    if (state === false) element.setAttribute('aria-hidden', 'false');
    else element.setAttribute('aria-hidden', 'true');
  },

  makeActive: (element, state) => {
    check(element, Element);
    check(state, Match.Maybe(Boolean));

    if (state === false) element.setAttribute('aria-expanded', 'false');
    else element.setAttribute('aria-expanded', 'true');
  },

  findAncestor: (element, className) => {
    check(element, Element);
    check(className, String);

    let currentElement = element;

    // Loop through ancestors until element with class is found
    while (currentElement instanceof Element) {
      if (currentElement.classList.contains(className)) break;

      currentElement = element.parentElement;
    }

    return currentElement;
  },
};
