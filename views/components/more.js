import { Template } from 'meteor/templating';
import Util from '/views/canvas/ui/util';

// more.js controls display events for elements containing details/more. Via hover or click.
const more = {
  toggleMore: (event) => {
    const parent = Util.findAncestor(event.target, 'more');
    const e = parent.getElementsByTagName('figure')[0];

    if (event.target.getAttribute('aria-expanded') === 'false') {
      Util.makeActive(event.target, true);
      Util.hide(e, false);
    } else {
      event.target.setAttribute('aria-expanded', 'false');
      Util.makeActive(event.target, false);
      Util.hide(e, true);
    }
  },
};

Template.body.events({
  // 'More' Hovers
  'mouseenter li.more > a': (event) => {
    if (window.innerWidth > 767) more.toggleMore(event);
  },

  'mouseleave li.more > a': (event) => {
    if (window.innerWidth > 767) more.toggleMore(event);
  },
});
