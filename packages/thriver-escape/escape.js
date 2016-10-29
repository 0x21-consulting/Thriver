/**
 * @summary Allow the user to escape the site using the ESC keyboard key
 * @method
 *   @param {$.Event} event - jQuery keydown event
 */
document.addEventListener('keydown', (event) => {
  // KeyCode 27 is the Escape key
  if (event && event.keyCode && event.keyCode === 27) {
    // Goto random Wikipedia page
    location.replace('https://en.wikipedia.org/wiki/Special:Random');
  }
});
