import { $ } from 'meteor/jquery';

// Focus.js controls our focus group functions.
// This is responsible for controling user-focusable areas based on user-interaction

/**
 * @summary Focus Method namespace
 * @namespace
 */
const Focus = {};

// Focusable Variables
Focus.focusable = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
Focus.globalFocusGroup = Array.from($('[data-focus="global"]').find(Focus.focusable));
[Focus.focusGlobalElFirst] = Focus.globalFocusGroup;
Focus.focusGlobalElLast = Focus.globalFocusGroup[Focus.globalFocusGroup.length - 1];
Focus.activeFocusGroup = Array.from($('[aria-hidden="false"][data-focus="group"]').find(Focus.focusable));
[Focus.focusGroupElFirst] = Focus.activeFocusGroup;
Focus.focusGroupElLast = Focus.activeFocusGroup[Focus.activeFocusGroup.length - 1];

// Focus Groups Events
let resetFocus = false;
let focusToGroup = false;
let topFocus = false;

// This only works if the tab key alone is being used.
// TODO(eoghantadhg): Add comments to adequately explain what's going on here
$('body').on('keydown', (event) => {
  const active = document.activeElement;

  if (event.keyCode === 9) {
    if ($(active).is(Focus.focusGroupElLast)) resetFocus = true; // :focusable
    if ($(active).is(Focus.focusGlobalElLast)) focusToGroup = true; // :focusable
    if ($(active).is(Focus.focusGroupElFirst)) topFocus = true; // :focusable
    if (!event.shiftKey) {
      topFocus = false;
      if (resetFocus === true) {
        Focus.focusGlobalElFirst.focus();
        resetFocus = false;
        event.preventDefault();
      }
      if (focusToGroup === true) {
        Focus.focusGroupElFirst.focus();
        focusToGroup = false;
        event.preventDefault();
      }
    }
    if (event.shiftKey) {
      resetFocus = false;
      focusToGroup = false;
      if (topFocus === true) {
        Focus.focusGlobalElLast.focus();
        topFocus = false;
        event.preventDefault();
      }
    }
  }
});

export default Focus;
