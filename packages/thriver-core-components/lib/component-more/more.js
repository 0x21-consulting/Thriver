// more.js controls display events for elements containing details/more. Via hover or click.
const more = {
  toggleMore: () => {
    const parent = Thriver.util.findAncestor(event.target, 'more');
    const e = parent.getElementsByTagName('figure')[0];

    if (event.target.getAttribute('aria-expanded') === 'false') {
      Thriver.util.makeActive(event.target, true);
      Thriver.util.hide(e, false);
    } else {
      event.target.setAttribute('aria-expanded', 'false');
      Thriver.util.makeActive(event.target, false);
      Thriver.util.hide(e, true);
    }
  },
};

Template.body.events({
  // 'More' Hovers
  'mouseenter li.more > a': () => {
    if (window.innerWidth > 767) more.toggleMore();
  },

  'mouseleave li.more > a': () => {
    if (window.innerWidth > 767) more.toggleMore();
  },
});
