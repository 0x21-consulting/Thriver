/* eslint-disable */
/* TODO: Properly lint and correct scope */
const Toast = function(options){
  const opts = {
    text: options.text,
    classes: options.classes || 'default',
    duration: options.duration || 4000,
  }
  const list = document.getElementById('toasts-list');
  const item = document.createElement('li');
  item.innerHTML= opts.text;
  item.classList.add(opts.classes);

  list.appendChild(item);
  window.setTimeout( function(){ item.classList.add('visible') }, 10);
  window.setTimeout( function(){ item.classList.remove('visible') }, opts.duration);
  window.setTimeout( function(){ item.remove(); }, opts.duration + 201);
};

export default Toast;