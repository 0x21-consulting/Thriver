import { Template } from 'meteor/templating';

import './preloader.html';

/**
 * @summary Show preloader by default
 * @method
 */
Template.canvas.onCreated(() => {
  window.setTimeout(() => document.querySelector('#app-preloader').classList.add('loading'));
});
