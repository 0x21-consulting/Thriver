import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import Util from '/views/canvas/ui/util';

import './tabs.html';

/**
 * @summary Show page upon menu item click
 * @method
 *   @param {$.Event} event
 */
const toggleTabs = (event) => {
  event.preventDefault();

  // Tabs Variables
  const menu = event.target.parentNode.parentNode;
  const links = menu.querySelectorAll('[aria-controls][data-toggle=tabs]');
  const sections = menu.parentNode.querySelectorAll('div.tabs [aria-hidden]');

  // Remove active state from all links
  for (let i = 0; i < links.length; i += 1) Util.makeActive(links[i], false);

  // Hide all sections
  for (let i = 0; i < sections.length; i += 1) Util.hide(sections[i], true);

  // Set link as active
  Util.makeActive(event.target, true);

  // Set section as active
  Util.hide(menu.parentElement
    .querySelector(`article[data-id="${event.target.dataset.id}"]`), false);

  // Special case for Library??  Why??
  switch (event.target.getAttribute('aria-controls')) {
    case '#library':
      document.querySelector('aside.filter').classList.add('active-filter'); break;
    default:
      document.querySelector('aside.filter').classList.remove('active-filter');
  }
};

Template.tabs.onRendered(() => {
  /**
   * @summary Remove Active Tabs on Mobile if not currently linked to
   */
  if ($(window).width() < 768) {
    // Get URL and collect deep link
    const url = window.location.href;
    const deepTab = url.substring(url.lastIndexOf('/') + 1);

    $('div.tabs > article').each(function mobileTab() {
      const dataId = $(this).attr('data-id');
      const tab = $(this).parent().parent().find(`menu.tabs > li > a[data-id=${dataId}]`);
      const masthead = $(this).parent().parent().parent()
        .hasClass('masthead');
      if (deepTab !== dataId && !masthead) {
        tab.attr('aria-expanded', false);
        $(this).attr('aria-hidden', true);
      }
    });
  }
});

Template.body.events({
  // Tabs
  'click [data-toggle=tabs]': toggleTabs,
});
