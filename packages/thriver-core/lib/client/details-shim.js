/**
 * details-shim.js
 * A pure JavaScript (no dependencies) solution to make HTML5
 *  Details/Summary tags work in unsupportive browsers
 *
 * Copyright (c) 2013 Tyler Uebele
 * Released under the MIT license.  See included LICENSE.txt
 *  or http://opensource.org/licenses/MIT
 *
 * latest version available at https://github.com/tyleruebele/details-shim
 */

/**
 * Enable proper operation of <details> tags in unsupportive browsers
 *
 * @param Details details element to shim
 * @returns {boolean} false on error
 */
function detailsShim(Details) {
  // For backward compatibility, if no DOM Element is sent, call init()
  if (!Details || !('nodeType' in Details) || !('tagName' in Details)) {
    return detailsShim.init();
  }

  let Summary;
  let details = Details;

  // If we were passed a details tag, find its summary tag
  if (details.tagName.toLowerCase() === 'details') {
    // Assume first found summary tag is the corresponding summary tag
    Summary = details.getElementsByTagName('summary')[0];

  // If we were passed a summary tag, find its details tag
  } else if (!!details.parentNode && details.tagName.toLowerCase() === 'summary') {
    Summary = details;
    details = Summary.parentNode;
  } else {
        // An invalid parameter was passed for Details
    return false;
  }

  // If the details tag is natively supported or already shimmed
  if (typeof details.open === 'boolean') {
    // If native, remove custom classes
    if (!details.getAttribute('data-open')) {
      details.className = details.className
        .replace(/\bdetails_shim_open\b|\bdetails_shim_closed\b/g, ' ');
    }
    return false;
  }

  // Set initial class according to `open` attribute
  let state = details.outerHTML
    // OR older firefox doesn't have .outerHTML
    || new XMLSerializer().serializeToString(details);

  state = state.substring(0, state.indexOf('>'));

  // Read: There is an open attribute, and it's not explicitly empty
  state = (state.indexOf('open') !== -1 && state.indexOf('open=""') === -1)
    ? 'open'
    : 'closed'
  ;
  details.setAttribute('data-open', state);
  details.classList.add(`details_shim_${state}`);

  // Add onclick handler to toggle visibility class
  if (Summary.addEventListener instanceof Function) {
    Summary.addEventListener('click', () => detailsShim.toggle(details));
  } else if (Summary.attachEvent instanceof Function) {
    Summary.attachEvent('onclick', () => detailsShim.toggle(details));
  }

  Object.defineProperty(details, 'open', {
    get: () => this.getAttribute('data-open') === 'open',
    set: newState => detailsShim.toggle(this, newState),
  });

  // wrap text nodes in span to expose them to css
  for (let j = 0; j < details.childNodes.length; j += 1) {
    if (details.childNodes[j].nodeType === 3
            && /[^\s]/.test(details.childNodes[j].data)
            ) {
      const span = document.createElement('span');
      const text = details.childNodes[j];
      details.insertBefore(span, text);
      details.removeChild(text);
      span.appendChild(text);
    }
  }

  return false;
} // details_shim()

/**
 * Toggle the open state of specified <details> tag
 * @param Details The <details> tag to toggle
 * @param state   Optional override state
 */
detailsShim.toggle = (Details, state) => {
  let newState;

  // If state was not passed, seek current state
  if (typeof state === 'undefined') {
    // new state
    newState = Details.getAttribute('data-open') === 'open'
        ? 'closed'
        : 'open'
    ;
  } else {
    // Sanitize the input, expect boolean, force string
    // Expecting boolean means even 'closed' will result in an open
    // This is the behavior of the natively supportive browsers
    newState = state ? 'open' : 'closed';
  }

  Details.setAttribute('data-open', newState);

  // replace previous open/close class
  Details.classList.remove('details_shim_open', 'details_shim_closed');
  Details.classList.add(`details_shim_${state}`);
};

/**
 * Run details_shim() on each details tag
 */
window.details_shim = {};
window.details_shim.init = () => {
  // Because <details> must include a <summary>,
  //  collecting <summary> tags collects *valid* <details> tags
  const Summaries = document.getElementsByTagName('summary');
  for (let i = 0; i < Summaries.length; i += 1) {
    detailsShim(Summaries[i]);
  }
};
