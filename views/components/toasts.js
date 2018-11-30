import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

const list = new ReactiveVar();

Template.toasts.onRendered(() => {
  list.set(document.getElementById('toasts-list'));
});

/**
 * @summary Display a short-lived notification on page
 * @param {Object} options
 */
const Toast = (options) => {
  const opts = {
    text: options.text,
    classes: options.classes || 'default',
    duration: options.duration || 4000,
  };

  Tracker.autorun(() => {
    if (list.get()) {
      const item = document.createElement('li');
      item.innerHTML = opts.text;
      item.classList.add(opts.classes);
      list.get().appendChild(item);

      window.setTimeout(() => item.classList.add('visible'), 10);
      window.setTimeout(() => item.classList.remove('visible'), opts.duration);
      window.setTimeout(() => item.remove(), opts.duration + 201);
    }
  });
};

export default Toast;
