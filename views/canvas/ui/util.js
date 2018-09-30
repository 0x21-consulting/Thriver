// UI Helper Functions
const Util = {
  // Add Class
  addClass: (element, className) => element.classList.add(className),

  // Remove Class
  removeClass: (element, className) => element.classList.remove(className),

  // Remove Class (by Prefix)
  removeClassByPrefix: (element, prefix) => {
    const regx = new RegExp(`\\b${prefix}.*?\\b`, 'g');

    const newElement = element;
    newElement.className = newElement.className.replace(regx, '');
    return newElement;
  },

  hide: (element, state) => {
    if (state === false) element.setAttribute('aria-hidden', 'false');
    else element.setAttribute('aria-hidden', 'true');
  },

  makeActive: (element, state) => {
    if (state === false) element.setAttribute('aria-expanded', 'false');
    else element.setAttribute('aria-expanded', 'true');
  },

  findAncestor: (element, className) => {
    let currentElement = element;

    // Loop through ancestors until element with class is found
    while (currentElement instanceof Element) {
      if (currentElement.classList.contains(className)) break;

      currentElement = element.parentElement;
    }

    return currentElement;
  },
};

export default Util;
