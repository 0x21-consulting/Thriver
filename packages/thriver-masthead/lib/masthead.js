// Populate Profile tab under Account Overview
Template.masthead.helpers({
  items: [{
    // Need to find away to get background images in here
    tabs: [{ // If sidebar has tabs: use this property
      title: 'Welcome to the new site!',
      id: 'mastheadSlideA', // These are for aria-controls
      template: 'slideA', // This could really just be an editable content area instead of unique templates
    }, {
      title: 'What does this site do?',
      id: 'mastheadSlideB',
      template: 'slideB',
    }, {
      title: 'The Movement is Bigger than WCASA',
      id: 'mastheadSlideC',
      template: 'slideC',
    }],
  }],
});

Template.masthead.onRendered(() => {
  // Auto Rotate function
  const transitionSlider = () => {
    const activeItem = document.querySelector('.masthead menu.tabs > li a[aria-expanded="true"]');
    const menuItems = document.querySelectorAll('.masthead menu.tabs > li');

    // If there is no active item, make the first active
    if (!activeItem) {
      document.querySelector('.masthead menu.tabs > li a')
        .setAttribute('aria-expanded', true);
    }

    // Set the appropriate item as active
    for (let i = 0; i < menuItems.length; i += 1) {
      const item = menuItems[i];

      // Look for which item is currently active
      if (item.children[0].getAttribute('aria-expanded') === 'true') {
        // If this is the last element
        if ((i + 1) === menuItems.length) menuItems[0].children[0].click();
        else menuItems[i + 1].children[0].click();

        break;
      }
    }
  };

  setInterval(transitionSlider, 15000);

  // Start
  transitionSlider();
});
