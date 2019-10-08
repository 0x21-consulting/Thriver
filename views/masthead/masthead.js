import { Template } from 'meteor/templating';
import './masthead.html';

// Populate Profile tab under Account Overview
Template.masthead.helpers({
  items: [{
    // Need to find away to get background images in here
    tabs: [{
      title: 'WCASA Training Institute',
      id: 'mastheadSlideA',
      template: 'slideA',
    }, {
      title: 'Events',
      id: 'mastheadSlideE',
      template: 'slideE',
    }, {
      title: 'Free Chrystul Kizer',
      id: 'mastheadSlideG',
      template: 'slideG',
    }, {
      title: 'The Bigger Movement',
      id: 'mastheadSlideB',
      template: 'slideB',
    }, {
      title: 'New SASPs Just Added!',
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
      document.querySelector('.masthead menu.tabs > li a').setAttribute('aria-expanded', true);
      document.querySelector('.masthead div.tabs > article').setAttribute('aria-hidden', false);
    } else {
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
    }
  };

  // Start
  transitionSlider();

  // Run Transition Interval if isPaused != true
  const masthead = document.querySelector('section.masthead');
  let isPaused = false;
  window.setInterval(() => {
    if (!isPaused) transitionSlider();
  }, 5000);

  // Toggle Pause
  masthead.addEventListener('mouseover', () => { isPaused = true; });
  masthead.addEventListener('mouseout', () => { isPaused = false; });
});
