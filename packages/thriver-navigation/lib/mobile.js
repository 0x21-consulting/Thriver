Template.navigationMobile.helpers(Thriver.mainNavigationHelpers);
Template.navigationMobile.helpers(Thriver.utilityNavigationHelpers);

Template.navigationMobile.events({
  'click [data-type="main-navigation-item"]': () => {
    const toggleMobile = document.querySelectorAll(
      '[aria-controls][data-toggle=mobile-navigation]');
    const mobileNavigation = document.getElementById('mobile-navigation');

    for (let i = 0; i < toggleMobile.length; i += 1) {
      Thriver.util.makeActive(toggleMobile[i], false);
    }

    Thriver.util.hide(mobileNavigation, true);
    document.body.classList.remove('noScroll');
  },

  'click #mobile-navigation li > a[href="#service-providers"]': (event) => {
    event.preventDefault();
    // m.toggleMore;  m is not defined
  },

  'click #mobile-navigation figure a[href="#service-providers"]': () => {
    const toggleMobile = document.querySelectorAll(
      '[aria-controls][data-toggle=mobile-navigation]');
    const mobileNavigation = document.getElementById('mobile-navigation');

    for (let i = 0; i < toggleMobile.length; i += 1) {
      Thriver.util.makeActive(toggleMobile[i], false);
    }

    Thriver.util.hide(mobileNavigation, true);
    document.body.classList.remove('noScroll');
  },
});
