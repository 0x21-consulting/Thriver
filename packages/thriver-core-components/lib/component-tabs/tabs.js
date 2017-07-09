/**
 * @summary Show page upon menu item click
 * @method
 *   @param {$.Event} event
 */
const toggleTabs = (event) => {
  check(event, $.Event);

  event.preventDefault();

  // Tabs Variables
  const menu = event.target.parentNode.parentNode;
  const links = menu.querySelectorAll('[aria-controls][data-toggle=tabs]');
  const sections = menu.parentNode.querySelectorAll('div.tabs [aria-hidden]');

  // Remove active state from all links
  for (let i = 0; i < links.length; i += 1) Thriver.util.makeActive(links[i], false);

  // Hide all sections
  for (let i = 0; i < sections.length; i += 1) Thriver.util.hide(sections[i], true);

  // Set link as active
  Thriver.util.makeActive(event.target, true);

  // Set section as active
  Thriver.util.hide(menu.parentElement
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
   * @summary Remove Active Tabs on Mobile
   */
  if ($(window).width() < 768) {
    $('menu.tabs > li > a').attr('aria-expanded', false);
    $('div.tabs > article').attr('aria-hidden', true);
  }
});

Template.body.events({
  // Tabs
  'click [data-toggle=tabs]': toggleTabs,
});
