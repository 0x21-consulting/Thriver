/**
 * @summary Delete a person
 * @method
 *   @param {$.Event} event
 */
let deletePerson = function (event)  {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Delete person upon confirmation
    if ( confirm('Are you sure you want to delete this person?') )
        Meteor.call('deletePerson', this._id);
},

/**
 * @summary Open insert form
 * @method
 *   @param {$.Event} event
 */
openForm = event => {
    check(event, $.Event);

    event.preventDefault();
    event.stopPropagation();

    // Show add form
    event.delegateTarget.querySelector('ul.clearfix').classList.add('hide');
    event.delegateTarget.querySelector('aside.addPerson').classList.remove('hide');
},

/**
 * @summary Close insert form
 * @method
 *   @param {$.Event} event
 */
closeForm = event => {
    check(event, $.Event);

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
Template.staff.events({ 'click aside.admin button.add'      : openForm  });
Template.board.events({ 'click aside.admin button.add'      : openForm  });
Template.staff.events({ 'click aside.addPerson button.close': closeForm });
Template.board.events({ 'click aside.addPerson button.close': closeForm });

/** Handle file upload and base64 encoding */
AutoForm.addHooks(['addStaffPerson', 'addBoardPerson'], { before: {
    /**
     * @summary Use Before Hook on addPerson forms to upload image and convert to base64
     * @method
     *   @param {Object} doc - Document to alter
     */
    method: function (doc) {
        check(doc, Object);

        // Scope for async reader load event function
        var that = this;

        // Get file
        let file = this.event.target.querySelector('input[type="file"]');
            file = file.files[0];

        // If there's no file, there's nothing to do here
        if (! (file instanceof File) )
            return doc;

        // Read in the file
        let reader = new FileReader();

        /**
         * @summary Read in file and convert to base64
         * @method
         *   @param {Event} event
         */
        (function (mimeType) { return reader.addEventListener('load', function (event) {
            check(event, Event);

            // Unsigned, 8-bit integer Array
            // event.target.result is of type ArrayBuffer
            let view = new Uint8Array(event.target.result),
            
            // Base 64 possible characters
            base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

            // Base64 string representation of image
            string = 'data:' + mimeType + ';base64,';

            // Base64 works by breaking three bytes into four six-bit segments
            // Each segment therefore must have a value between 0 and 64.
            // That allows easy encoding using the base64 string above
            for (let i = 0; i < view.byteLength; i += 3) {
                // First six bits (remove last two bits)
                let segment = (view[i] & 0xFC) >> 2;

                // Encode
                string += base64.charAt(segment);

                // Segment two (keep first nibble)
                segment = (view[i] & 0x03) << 4;

                // If there are no more bytes because the array is exhausted,
                // encode this nibble and output two markers
                if (i + 1 >= view.byteLength) {
                    string += base64.charAt(segment) + '==';
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
                    string += base64.charAt(segment) + '=';
                    break;
                }

                // Complete segment with first two bits of third byte
                segment |= (view[i + 2] & 0xC0) >> 6;
                string += base64.charAt(segment);

                // Final (fourth) segment using last six bits of third byte
                segment = view[i + 2] & 0x3F;
                string += base64.charAt(segment);
            }

            // Set picture right
            doc.picture = string;

            // Let form submit continue asynchronously
            that.result(doc);
        })})(file.type);

        // Read in file as an Array Buffer
        reader.readAsArrayBuffer(file);
    }
}, after: {
    /** Close form after submission */
    method: function () {
        let button = this.event.target.parentElement.querySelector('button.close');
        if (button instanceof Element)
            button.click();
    }
} });
