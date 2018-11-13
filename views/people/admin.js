import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

/**
 * @summary Delete a person
 * @method
 *   @param {$.Event} event
 */
const deletePerson = (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Delete person upon confirmation
  if (window.confirm('Are you sure you want to delete this person?')) {
    Meteor.call('deletePerson', Template.instance().data._id);
  }
};

/**
 * @summary Open insert form
 * @method
 *   @param {$.Event} event
 */
const openForm = (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Show add form
  event.delegateTarget.querySelector('ul.clearfix').classList.add('hide');
  event.delegateTarget.querySelector('.addPerson').classList.remove('hide');
};

/**
 * @summary Close insert form
 * @method
 *   @param {$.Event} event
 */
const closeForm = (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Hide add form
  event.delegateTarget.querySelector('ul.clearfix').classList.remove('hide');
  event.delegateTarget.querySelector('aside.addPerson').classList.add('hide');
};

/** Bind admin events */
Template.personStaff.events({ 'click aside.admin button.delete': deletePerson });
Template.personBoard.events({ 'click aside.admin button.delete': deletePerson });

/** Show/Hide Insert form */
Template.staff.events({ 'click aside.admin button.add': openForm });
Template.board.events({ 'click aside.admin button.add': openForm });
Template.staff.events({ 'click aside.addPerson button.close': closeForm });
Template.board.events({ 'click aside.addPerson button.close': closeForm });

/** Add Person Forms */
Template.addPersonForm.helpers({ formId: '0-1' });
Template.addPersonForm.events({
  /**
   * @summary Add Person Form Submission
   * @method
   *   @param {$.Event} ev
   */
  'submit form.admin-form-person-add': (event) => {
    event.preventDefault();
    /**
     * @summary Use Before addPerson forms submission to upload image and convert to base64
     * @method
     *   @param {Element} form - The HTML form
     *   @param {Function} cb - Callback function
     */
    const readAvatar = (form, cb) => {
      let picture = '';

      // Get file
      let file = form.querySelector('input[type="file"]');
      [file] = file.files;

      if (!file) return cb();

      // Read in the file
      const reader = new FileReader();

      /**
       * @summary Read in file and convert to base64
       * @method
       *   @param {Event} ev
       */
      (function (mimeType) { // eslint-disable-line func-names
        return reader.addEventListener('load', (ev) => {
          // Unsigned, 8-bit integer Array
          // event.target.result is of type ArrayBuffer
          const view = new Uint8Array(ev.target.result);
          console.log(`Image size: ${view.byteLength}`);
          console.log(ev.target);

          // Base 64 possible characters
          const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

          // Base64 string representation of image
          let string = `data:${mimeType};base64,`;

          // Base64 works by breaking three bytes into four six-bit segments
          // Each segment therefore must have a value between 0 and 64.
          // That allows easy encoding using the base64 string above
          for (let i = 0; i < view.byteLength; i += 3) {
            /* eslint-disable no-bitwise */

            // First six bits (remove last two bits)
            let segment = (view[i] & 0xFC) >> 2;

            // Encode
            string += base64.charAt(segment);

            // Segment two (keep first nibble)
            segment = (view[i] & 0x03) << 4;

            // If there are no more bytes because the array is exhausted,
            // encode this nibble and output two markers
            if (i + 1 >= view.byteLength) {
              string += `${base64.charAt(segment)}==`;
              break;
            }

            // Add first nibble from second byte
            segment |= (view[i + 1] & 0xF0) >> 4;
            string += base64.charAt(segment);

            // Segment three (last nibble of second byte)
            segment = (view[i + 1] & 0x0F) << 2;

            // If there are no more bytes because the array is exhausted,
            // enocde this segment and output one marker
            if (i + 2 >= view.byteLength) {
              string += `${base64.charAt(segment)}=`;
              break;
            }

            // Complete segment with first two bits of third byte
            segment |= (view[i + 2] & 0xC0) >> 6;
            string += base64.charAt(segment);

            // Final (fourth) segment using last six bits of third byte
            segment = view[i + 2] & 0x3F;
            string += base64.charAt(segment);

            /* eslint-enable */
          }

          // Set picture right
          picture = string;

          // Let form submit continue asynchronously
          cb(picture);
        });
      }(file.type));

      // Read in file as an Array Buffer
      reader.readAsArrayBuffer(file);

      return undefined;
    };

    const form = event.delegateTarget.querySelectorAll('.admin-form-person-add')[0];

    const addPerson = (picture) => {
      const data = {
        name: form.querySelectorAll('input[name=person-add-form-name]')[0].value,
        title: form.querySelectorAll('input[name=person-add-form-title]')[0].value,
        email: form.querySelectorAll('input[name=person-add-form-email]')[0].value,
        boardMember: form.querySelectorAll('input[name=person-add-form-board-member]')[0].checked,
        picture,
      };

      // Insert subscriber into the collection
      Meteor.call('addPerson', data, function(error) {
        console.log('calling');
        if (error) {
          console.log(error.reason);
        } else {
          console.log('Subscription successful');
          console.log(data);
        }
      });
    };

    readAvatar(form, addPerson);
  },
});
