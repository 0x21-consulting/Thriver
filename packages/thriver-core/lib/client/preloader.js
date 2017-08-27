/**
 * @summary Handle form submission
 * @method
 */
Template.canvas.onRendered(() => {
  window.setTimeout(() => document.querySelector('#app-preloader').classList.add('loading'), 100);
});
