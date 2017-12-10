// Focus.js controls our focus group functions.
// This is responsible for controling user-focusable areas based on user-interaction

/**
 * @summary Focus Method namespace
 * @namespace
 */
Thriver.focus = {};

// Focusable Variables
Thriver.focus.focusable = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
Thriver.focus.globalFocusGroup = $('[data-focus="global"]').find(Thriver.focus.focusable);
[Thriver.focus.focusGlobalElFirst] = Thriver.focus.globalFocusGroup;
Thriver.focus.focusGlobalElLast =
  Thriver.focus.globalFocusGroup[Thriver.focus.globalFocusGroup.length - 1];
Thriver.focus.activeFocusGroup = $('[aria-hidden="false"][data-focus="group"]').find(Thriver.focus.focusable);
[Thriver.focus.focusGroupElFirst] = Thriver.focus.activeFocusGroup;
Thriver.focus.focusGroupElLast =
  Thriver.focus.activeFocusGroup[Thriver.focus.activeFocusGroup.length - 1];

// Focus Groups Events
let resetFocus = false;
let focusToGroup = false;
let topFocus = false;

// This only works if the tab key alone is being used.
// TODO(eoghantadhg): Add comments to adequately explain what's going on here
$('body').on('keydown', (event) => {
  check(event, $.Event);

  const active = document.activeElement;

  if (event.keyCode === 9) {
    if ($(active).is(Thriver.focus.focusGroupElLast)) resetFocus = true; // :focusable
    if ($(active).is(Thriver.focus.focusGlobalElLast)) focusToGroup = true; // :focusable
    if ($(active).is(Thriver.focus.focusGroupElFirst)) topFocus = true; // :focusable
    if (!event.shiftKey) {
      topFocus = false;
      if (resetFocus === true) {
        Thriver.focus.focusGlobalElFirst.focus();
        resetFocus = false;
        event.preventDefault();
      }
      if (focusToGroup === true) {
        Thriver.focus.focusGroupElFirst.focus();
        focusToGroup = false;
        event.preventDefault();
      }
    }
    if (event.shiftKey) {
      resetFocus = false;
      focusToGroup = false;
      if (topFocus === true) {
        Thriver.focus.focusGlobalElLast.focus();
        topFocus = false;
        event.preventDefault();
      }
    }
  }
});
