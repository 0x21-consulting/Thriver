import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import History from './history';

/**
 * @summary Smooth scroll to a linked section
 * @method
 *   @param {string} path - Element ID to scroll to
 */
const smoothScroll = (path) => {
  // Get rid of leading slashes and any sub paths
  const newPath = path.replace(/^\/*/, '').replace(/\/.*/g, '');

  // Get target element (that the anchor links to)
  // Otherwise, default to top of screen
  const target = newPath ? $(`[id="${newPath}"]`) : $('body');

  // If no target, don't bother
  if (!target.length) return;

  // Where are we presently?
  const posY = window.scrollY;

  // Calculate target Y offset
  const offset = target.offset().top - 96;

  // We want to scroll at 750 pixels per second
  const speed = Math.abs(posY - offset);

  // Smooth scroll to target
  $('.mainNav li a').removeClass('active');

  // http://stackoverflow.com/questions/8149155/animate-scrolltop-not-working-in-firefox
  $('body,html').stop(true, true)
    .animate({ scrollTop: offset }, speed > 750 ? 750 : speed);
};

/**
 * @summary Handle anchor click event to smooth scroll
 * @method
 *   @param {$.Event} event - jQuery Event triggered by <a> element click
 */
const smoothScrollEventHandler = (event) => {
  // Don't allow page to navigate away
  event.preventDefault();
  event.stopPropagation();

  // Smooth scroll to anchor's href destination
  History.navigate(event.currentTarget.pathname);
};

/**
 * @summary Timout in milliseconds to wait until scroll completion
 * @type {number}
 */
let timeout = 0;

/**
 * @summary Handle Header state change on scroll
 * @method
 *   @param {$.Event} event - jQuery Scroll event triggered by user scroll
 */
const handleHeaderStateChange = () => {
  // Why we're using timers here:
  // The scroll event will fire for every pixel (or browser/OS-specific unit)
  // scrolled, causing major performance issues, especially when interacting
  // with the DOM as we do here by adding and removing classes.
  //
  // Instead, we use timeouts to wait for a scroll to complete before executing
  // CPU-intensive code.  For each time the event fires, the timeout is cleared,
  // essentially causing the code to wait until the event is fired for its
  // last time.

  // Clear the timeout
  clearTimeout(timeout);

  // Set a timeout to add the class after one millisecond
  timeout = setTimeout(() => {
    // Read style calculations before writing to avoid forced synchronous layout
    // @link https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#avoid-forced-synchronous-layouts
    const { scrollY, innerWidth } = window;
    if (scrollY > 260 && innerWidth > 767) {
      document.body.classList.remove('fixedHeaderReturn');
      document.body.classList.add('fixedHeader');
    } else {
      document.body.classList.remove('fixedHeader');
      document.body.classList.add('fixedHeaderReturn');
    }

    // Back to Top
    // TODO(eoghantadhg): move this into appropriate module
    if (document.getElementById('back-to-top')) {
      if (scrollY > 1000 && innerWidth > 767) {
        document.getElementById('back-to-top').classList.add('active');
      } else document.getElementById('back-to-top').classList.remove('active');
    }
  }, 1);
};

// Handle header state change
Template.canvas.onRendered(() => window.addEventListener('scroll', handleHeaderStateChange));

export { smoothScroll, smoothScrollEventHandler };
